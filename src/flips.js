/* Front/back replacement at the edge-on instant. No mirrored character art. */
(function(root){
 function pose(from,to,p){p=Math.max(0,Math.min(1,p));const eased=p*p*(3-2*p);return{shownExpression:p<.5?from:to,flipWidth:Math.abs(Math.cos(Math.PI*eased))};}
 class Controller{
  constructor(){this.states=new Map();}
  clear(){this.states.clear();}
  update(a,now,enabled=true,ms=550){
   let s=this.states.get(a.id);
   if(!s){s={visible:a.shownExpression||a.expression,transition:null};this.states.set(a.id,s);}
   if(!enabled){s.visible=a.expression;s.transition=null;}
   if(s.transition){const tr=s.transition,p=(now-tr.start)/tr.ms;Object.assign(a,pose(tr.from,tr.to,p));if(p>=1){s.visible=tr.to;s.transition=null;}else return;}
   if(enabled&&s.visible!==a.expression){s.transition={from:s.visible,to:a.expression,start:now,ms};Object.assign(a,pose(s.visible,a.expression,0));}
   else{a.shownExpression=s.visible;a.flipWidth=1;}
  }
 }
 root.PuppetFlips={pose,Controller};if(typeof module!=='undefined')module.exports=root.PuppetFlips;
})(globalThis);
