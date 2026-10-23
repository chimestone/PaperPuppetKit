const fs=require('node:fs'),path=require('node:path'),{parseLrc,srt,vtt}=require('../src/captions.cjs');
const input=process.argv[2],prefix=process.argv[3]||'out/captions';
if(!input){console.error('Usage: node scripts/captions.cjs path/to/lyrics.lrc [out/prefix]');process.exit(1);}
const cues=parseLrc(fs.readFileSync(input,'utf8'));if(!cues.length)throw Error('No timed lyrics found');
fs.mkdirSync(path.dirname(prefix),{recursive:true});fs.writeFileSync(prefix+'.srt',srt(cues));fs.writeFileSync(prefix+'.vtt',vtt(cues));console.log('Wrote '+cues.length+' cues');
