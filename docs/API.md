# 镜头 API

镜头为工具包内的 HTML 文件，使用相对路径加载图片和脚本。无 CDN、无用户账户。

```js
window.scene = {width:1280, height:720, fps:24, duration:10};
window.ready = Promise.all(/* image.decode() 等资源载入 */);
window.renderAt = seconds => { /* 在 canvas#stage 上画出指定时刻 */ };
```

渲染器加载页面、等待 ready，然后调用 renderAt(i/fps)。画布尺寸必须和 scene 一致。不要依赖实时播放状态、Date.now 或未设定种子的 Math.random。

## 运行时模块

加载 `src/motions.js`、`src/flips.js`、`src/stage.js` 后，页面得到 `PuppetMotions`、`PuppetFlips`、`PaperStage`。

- `PuppetMotions.pose(base, name, progress, strength=1, distance=180)`：返回新姿态，不修改 base。name 为 left/right/happy/shy/surprised/sad/angry。
- `PuppetFlips.pose(from, to, progress)`：返回 shownExpression 与 flipWidth。progress 范围 0–1，中点换图。
- `new PuppetFlips.Controller().update(actor, nowMs, enabled, durationMs)`：用于实时输入，跟踪待完成翻面。
- `PaperStage.puppet(ctx, image, {x,y,scale,angle,flip,anchor,rod,rodWidth})`：angle 为度，默认脚底锚点 [256,704]；所有素材使用统一画布。
- `paperImage(image, border=5)`：返回增加白边后的 Canvas。四边新增 border×2 留白；调用 puppet 时 anchor 同样加上这段留白。
- `hanging(ctx,image,{x,y,width,angle,attach,top})`：单根线；attach 为图片内归一化附着点。
- `cover(ctx,image,zoom=1)`：等比铺满背景，zoom 可由时间插值。
- `notebook(ctx,{x,y,width,open,time,drawRight})`：关闭时轻晃，打开时固定；drawRight(ctx,w,h) 在右页中心坐标系内画内容。
- `rightPageCamera(ctx,{x,y,width},progress,draw)`：镜头移向右页；draw 在相机变换内画场景。
- `faceMark(ctx,image,{x,y,size,time,seed})`：独立标记的轻微扭动；先应用角色局部坐标变换，再定位标记。
- `shatter(ctx,oldFrame,newFrame,progress)`：旧层碎开，新层始终完整。
- `caption(ctx,cues,time)`：画当前一句底部字幕；cue 为 `{start,end,text}`。

## 排练室工程

format 为 `paper-puppet-studio`，version 为 1。actors 保存当前姿态，take 保存 `{t,actors}` 轨迹，background 和 customAssets 保存本地图片 data URL。

两个固定角色 ID 为 boy/girl（兼容早期工程），界面显示纸偶 A/B。已有 take 的轨迹记录实际显示的表情及翻面宽度，导入后不依赖自动动作按钮。没有 customAssets 的旧文件使用占位图。

排练室轨迹和 `window.renderAt` 镜头是两种入口；当前没有一键把任意排练轨迹转成镜头 HTML 的功能。可以复用 take 中的姿态数据写自己的 renderAt。
