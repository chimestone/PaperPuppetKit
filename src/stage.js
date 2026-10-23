/* Small Canvas 2D helpers. Every pose is evaluated at absolute time. */
(function(root){
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
 function paperImage(image,border=5){
  const c=document.createElement('canvas');c.width=image.width+border*4;c.height=image.height+border*4;
  const g=c.getContext('2d'),pad=border*2;
  for(let i=0;i<24;i++){const a=i*Math.PI/12;g.drawImage(image,pad+Math.cos(a)*border,pad+Math.sin(a)*border);}
  g.globalCompositeOperation='source-in';g.fillStyle='#fffaf0';g.fillRect(0,0,c.width,c.height);
  g.globalCompositeOperation='source-over';g.drawImage(image,pad,pad);return c;
 }
 function puppet(g,image,{x,y,scale=1,angle=0,flip=1,anchor=[256,704],rod=true,rodWidth=14}){
  g.save();g.translate(x,y);g.rotate(angle*Math.PI/180);g.scale(scale,scale);
  if(rod){g.fillStyle='#c7a574';g.fillRect(-rodWidth/2,-194,rodWidth,1500);}
  g.scale(flip,1);g.drawImage(image,-anchor[0],-anchor[1]);g.restore();
 }
 function hanging(g,image,{x,y,width,angle=0,attach=[.5,.1],top=-100}){
  const h=width*image.height/image.width,ax=(attach[0]-.5)*width,ay=(attach[1]-.5)*h,r=angle*Math.PI/180;
  const sx=x+ax*Math.cos(r)-ay*Math.sin(r),sy=y+ax*Math.sin(r)+ay*Math.cos(r);
  g.save();g.strokeStyle='#e9dfc8';g.lineWidth=2;g.beginPath();g.moveTo(sx,top);g.lineTo(sx,sy);g.stroke();
  g.translate(x,y);g.rotate(r);g.drawImage(image,-width/2,-h/2,width,h);g.restore();
 }
 function cover(g,image,zoom=1){const {width:w,height:h}=g.canvas,s=Math.max(w/image.width,h/image.height)*zoom;g.drawImage(image,(w-image.width*s)/2,(h-image.height*s)/2,image.width*s,image.height*s);}
 function notebook(g,{x,y,width=350,open=false,time=0,drawRight=()=>{}}){
  g.save();g.translate(x,y);if(!open)g.rotate(Math.sin(time*1.9)*.035);
  const w=width,h=width*.68;g.lineJoin='round';g.lineWidth=9;g.strokeStyle='#fffaf0';g.fillStyle=open?'#fff2d8':'#bb8e66';g.strokeRect(-w/2,-h/2,w,h);g.fillRect(-w/2,-h/2,w,h);
  if(open){g.strokeStyle='#bba789';g.lineWidth=2;g.beginPath();g.moveTo(0,-h/2);g.lineTo(0,h/2);g.stroke();
   g.save();g.beginPath();g.rect(8,-h/2+10,w/2-18,h-20);g.clip();g.translate(w/4,0);drawRight(g,w/2-24,h-24);g.restore();}
  g.restore();
 }
 function rightPageCamera(g,{x,y,width},progress,draw){
  const p=ease(progress),z=1+p*3;g.save();g.translate(g.canvas.width/2,g.canvas.height/2);g.scale(z,z);g.translate(-(g.canvas.width/2*(1-p)+(x+width/4)*p),-(g.canvas.height/2*(1-p)+y*p));draw();g.restore();
 }
 function shatter(g,oldFrame,newFrame,progress){
  const w=g.canvas.width,h=g.canvas.height,q=ease(progress);g.drawImage(newFrame,0,0,w,h);
  if(q>=1)return;if(q<=0){g.drawImage(oldFrame,0,0,w,h);return;}
  const edge=[[0,0],[w/3,0],[2*w/3,0],[w,0],[w,h/2],[w,h],[2*w/3,h],[w/3,h],[0,h],[0,h/2]];
  for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length],cx=(w/2+a[0]+b[0])/3,cy=(h/2+a[1]+b[1])/3,dx=cx-w/2,dy=cy-h/2,len=Math.hypot(dx,dy)||1;
   g.save();g.translate(cx+dx/len*q*w,cy+dy/len*q*w+q*q*h*.2);g.rotate(q*(i%2?-.5:.5));g.translate(-cx,-cy);g.beginPath();g.moveTo(w/2,h/2);g.lineTo(...a);g.lineTo(...b);g.closePath();g.clip();g.drawImage(oldFrame,0,0,w,h);g.restore();}
 }
 function faceMark(g,image,{x,y,size,time=0,seed=0}){
  const t=Math.floor(time*12)/12,z=t*7.1+seed*1.73;g.save();g.translate(x,y);g.rotate(Math.sin(z)*.13);g.transform(1+.06*Math.sin(z*1.4),0,.055*Math.cos(z*.8),1+.07*Math.cos(z*1.2),0,0);g.drawImage(image,-size/2,-size/2,size,size);g.restore();
 }
 function caption(g,cues,time){const c=cues.find(x=>time>=x.start&&time<x.end);if(!c)return;g.save();g.font='30px sans-serif';g.textAlign='center';g.textBaseline='bottom';g.lineJoin='round';g.lineWidth=4;g.strokeStyle='#181818';g.fillStyle='white';g.strokeText(c.text,g.canvas.width/2,g.canvas.height-28);g.fillText(c.text,g.canvas.width/2,g.canvas.height-28);g.restore();}
 root.PaperStage={clamp,ease,paperImage,puppet,hanging,cover,notebook,rightPageCamera,shatter,faceMark,caption};
})(globalThis);
