function parseLrc(text,{duration=Infinity,lastLineSeconds=6}={}){
 const offset=Number(text.match(/\[offset:([+-]?\d+)\]/i)?.[1]||0)/1000,rows=[];
 for(const line of text.split(/\r?\n/)){const tags=[...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)],value=line.replace(/\[[^\]]*\]/g,'').trim();for(const tag of tags)rows.push({start:Math.max(0,Number(tag[1])*60+Number(tag[2])+offset),text:value});}
 rows.sort((a,b)=>a.start-b.start);
 return rows.flatMap((r,i)=>{const end=Math.min(duration,rows[i+1]?.start??r.start+lastLineSeconds);return r.text&&end>r.start?[{...r,end}]:[];});
}
function timestamp(t,sep=','){const n=Math.round(t*1000),h=Math.floor(n/3600000),m=Math.floor(n/60000)%60,s=Math.floor(n/1000)%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}${sep}${String(n%1000).padStart(3,'0')}`;}
const srt=cues=>cues.map((c,i)=>`${i+1}\n${timestamp(c.start)} --> ${timestamp(c.end)}\n${c.text}\n`).join('\n');
const vtt=cues=>'WEBVTT\n\n'+cues.map(c=>`${timestamp(c.start,'.')} --> ${timestamp(c.end,'.')}\n${c.text}\n`).join('\n');
module.exports={parseLrc,srt,vtt};
