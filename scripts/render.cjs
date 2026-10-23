const fs=require('node:fs'),path=require('node:path'),{spawn,spawnSync}=require('node:child_process'),{once}=require('node:events');
const {createServer}=require('./serve.cjs'),{chromePath}=require('./runtime.cjs');
const root=path.resolve(__dirname,'..'),args=process.argv.slice(2),get=(key,fallback)=>{const i=args.indexOf(key);if(i<0)return fallback;if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing '+key+' value');return args[i+1];};
const scenePath=get('--scene','examples/demo.html'),output=path.resolve(root,get('--out','out/demo.mp4')),audio=get('--audio',null),ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
(async()=>{
 if(path.isAbsolute(scenePath)||scenePath.split(/[\\/]/).includes('..'))throw Error('--scene must be inside the toolkit');
 const probe=spawnSync(ffmpeg,['-version'],{encoding:'utf8'});if(probe.status!==0)throw Error('FFmpeg not found. Install it or set FFMPEG_PATH.');
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,encoder;
 try{
  const pp=require('puppeteer-core');browser=await pp.launch({executablePath:chromePath(),headless:true});const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/${scenePath.replaceAll('\\','/')}`);await page.evaluate(()=>window.ready);
  const meta=await page.evaluate(()=>window.scene);if(!meta||!['width','height','fps','duration'].every(k=>Number.isFinite(meta[k])&&meta[k]>0)||meta.duration>3600)throw Error('Scene must expose window.scene, ready, renderAt and canvas#stage');
  const frames=Math.round(meta.duration*meta.fps);fs.mkdirSync(path.dirname(output),{recursive:true});
  const ffargs=['-hide_banner','-y','-v','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(meta.fps),'-i','pipe:0'];
  if(audio)ffargs.push('-i',path.resolve(audio));ffargs.push('-t',String(frames/meta.fps),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p');
  if(audio)ffargs.push('-map','0:v','-map','1:a','-af','apad','-c:a','aac','-b:a','192k');ffargs.push('-movflags','+faststart',output);
  encoder=spawn(ffmpeg,ffargs,{stdio:['pipe','ignore','pipe']});let stderr='';encoder.stderr.on('data',d=>stderr+=d);let pipeError;encoder.stdin.on('error',e=>pipeError=e);const done=once(encoder,'close');
  for(let i=0;i<frames;i++){if(pipeError||encoder.exitCode!==null)throw Error(stderr||'Encoder stopped');const data=await page.evaluate(t=>{window.renderAt(t);return document.getElementById('stage').toDataURL('image/jpeg',.96).split(',')[1];},i/meta.fps);if(!encoder.stdin.write(Buffer.from(data,'base64')))await once(encoder.stdin,'drain');}
  encoder.stdin.end();const[code]=await done;if(code!==0||errors.length)throw Error(stderr+'\n'+errors.join('\n'));
  const decode=spawnSync(ffmpeg,['-v','error','-i',output,'-f','null','-'],{encoding:'utf8'});if(decode.status!==0)throw Error(decode.stderr);
  fs.writeFileSync(output+'.json',JSON.stringify({scene:scenePath,...meta,frames,audio:!!audio,errors,decoded:true},null,2));console.log(output);
 }finally{if(encoder&&encoder.exitCode===null)encoder.kill();if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
