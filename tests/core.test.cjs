const test=require('node:test'),assert=require('node:assert/strict');
const {pose:flip,Controller}=require('../src/flips.js'),{pose:motion}=require('../src/motions.js'),{parseLrc,srt,vtt}=require('../src/captions.cjs');
test('flip changes the visible state only at the edge, and completes queued changes',()=>{
 assert.equal(flip('a','b',.49).shownExpression,'a');assert.equal(flip('a','b',.5).shownExpression,'b');assert.ok(flip('a','b',.5).flipWidth<1e-10);
 const c=new Controller(),a={id:'one',expression:'neutral'};c.update(a,0);a.expression='happy';c.update(a,1);a.expression='sad';c.update(a,301);assert.equal(a.shownExpression,'happy');c.update(a,551);c.update(a,1101);assert.equal(a.shownExpression,'sad');assert.equal(a.flipWidth,1);
});
test('walking is deterministic and never mutates the starting pose',()=>{
 const base={x:1100,y:600,angle:0,scale:.65,expression:'neutral'},saved={...base};
 const end=motion(base,'right',1,1,300);assert.equal(end.x,1130);assert.equal(end.y,600);assert.deepEqual(base,saved);
 assert.deepEqual(motion(base,'happy',.4),motion(base,'happy',.4));
});
test('LRC supports repeated timestamps, blank rests and offset; caps final cue',()=>{
 const cues=parseLrc('[offset:100]\n[00:01.00][00:05.00]Example\n[00:03.00]\n[00:08.00]End',{duration:10});
 assert.deepEqual(cues,[{start:1.1,end:3.1,text:'Example'},{start:5.1,end:8.1,text:'Example'},{start:8.1,end:10,text:'End'}]);assert.match(srt(cues),/00:00:01,100 --> 00:00:03,100/);assert.ok(vtt(cues).startsWith('WEBVTT'));
});
