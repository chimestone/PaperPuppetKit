const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('./serve.cjs'),{chromePath}=require('./runtime.cjs');
const root=path.resolve(__dirname,'..');
(async()=>{const pp=require('puppeteer-core'),server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 const url=`http://127.0.0.1:${server.address().port}`,errors=[];browser=await pp.launch({executablePath:chromePath(),headless:true});const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width:1440,height:1080});
 await p.goto(url+'/studio/index.html');await p.waitForFunction(()=>document.getElementById('status').textContent.includes('就绪'));
 const before=await p.evaluate(()=>studio.getState());assert.equal(before.actors.length,2);
 await p.click('[data-motion="right"]');await p.waitForFunction(()=>studio.getState().actors[0].x>450);await p.evaluate(()=>studio.stop());
 // Round trip a user image and animation data through the real import handler.
 const userImage=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=512;c.height=768;const g=c.getContext('2d');g.fillStyle='#9a5';g.fillRect(128,128,256,570);return c.toDataURL();});
 const state=await p.evaluate(()=>{studio.demo();studio.stop();return studio.getState();});state.customAssets={boy:{neutral:userImage}};
 fs.mkdirSync(path.join(root,'out'),{recursive:true});const project=path.join(root,'out/check-project.json');fs.writeFileSync(project,JSON.stringify(state));await(await p.$('#load')).uploadFile(project);await p.waitForFunction(()=>document.getElementById('status').textContent==='工程已打开');
 const after=await p.evaluate(()=>studio.getState());assert.equal(after.customAssets.boy.neutral,userImage);assert.equal(after.take.length,241);assert.deepEqual(after.actors,state.actors);
 await p.click('#record');await p.waitForFunction(()=>studio.getState().take.length>=90,{timeout:12000});await p.click('#stop');await p.waitForFunction(()=>document.querySelector('#downloads a'));const recording=await p.evaluate(async()=>{const b=await(await fetch(document.querySelector('#downloads a').href)).blob();return {size:b.size,type:b.type};});assert.ok(recording.size>1000);assert.match(recording.type,/webm/);
 await p.goto(url+'/examples/demo.html');await p.evaluate(()=>ready);const order=await p.evaluate(()=>{renderAt(9.2);const a=canvas.toDataURL();renderAt(7.5);const b=canvas.toDataURL();return a!==b;});assert.ok(order);
 await p.evaluate(()=>renderAt(8.15));await p.screenshot({path:path.join(root,'out/browser-example.png')});
 const denied=await fetch(url+'/.git/config');assert.equal(denied.status,403);assert.deepEqual(errors,[]);
 const report={projectRoundTrip:true,embeddedUserImage:true,recording,sceneChanges:true,privateFilesDenied:true,errors};fs.writeFileSync(path.join(root,'out/browser-check.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
