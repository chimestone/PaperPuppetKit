/* Each pose is derived from a fixed starting pose, avoiding cumulative drift. */
(function(root){
 const presets={left:{label:'向左走',seconds:2.4},right:{label:'向右走',seconds:2.4},happy:{label:'开心蹦跳',seconds:1.8},shy:{label:'害羞摇摆',seconds:2.4},surprised:{label:'惊讶后仰',seconds:1.5},sad:{label:'难过低垂',seconds:2.6},angry:{label:'生气抖动',seconds:1.6}};
 const smooth=x=>x*x*(3-2*x);
 function pose(base,name,progress,strength=1,distance=180){
  const p=Math.max(0,Math.min(1,progress)),out={...base},envelope=Math.sin(Math.PI*p),s=strength*base.scale/.65;
  if(name==='left'||name==='right'){
   const direction=name==='left'?-1:1;
   const target=Math.max(150,Math.min(1130,base.x+direction*distance));
   out.x=base.x+(target-base.x)*smooth(p);
   out.y=base.y-Math.abs(Math.sin(p*Math.PI*4))*13*s*envelope;
   out.angle=base.angle+(-direction*4+Math.sin(p*Math.PI*8)*3)*envelope*strength;
  }else if(name==='happy'){
   out.expression='happy';out.y=base.y-Math.abs(Math.sin(p*Math.PI*3))*48*s*envelope;
   out.angle=base.angle+Math.sin(p*Math.PI*6)*7*envelope*strength;
  }else if(name==='shy'){
   out.expression='shy';out.angle=base.angle+Math.sin(p*Math.PI*4)*8*envelope*strength;
   out.y=base.y+10*s*envelope;
  }else if(name==='surprised'){
   out.expression='surprised';const kick=p<.18?smooth(p/.18):Math.pow(1-(p-.18)/.82,2);
   out.y=base.y-24*s*kick;out.angle=base.angle-16*strength*kick;
  }else if(name==='sad'){
   out.expression='sad';const sink=smooth(Math.min(1,p/.4));
   out.y=base.y+25*s*sink;out.angle=base.angle+9*strength*sink+Math.sin(p*Math.PI*3)*envelope;
  }else if(name==='angry'){
   out.expression='angry';out.angle=base.angle+Math.sin(p*Math.PI*16)*5*envelope*strength;
   out.y=base.y-Math.abs(Math.sin(p*Math.PI*4))*9*s*envelope;
  }
  return out;
 }
 root.PuppetMotions={presets,pose};
 if(typeof module!=='undefined')module.exports=root.PuppetMotions;
})(globalThis);
