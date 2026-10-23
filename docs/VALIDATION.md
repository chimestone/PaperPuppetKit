# v0.1.0 验证记录

日期：2026-10-24。环境：Windows、Node.js 24.13.1、Chrome、FFmpeg。

- 独立目录执行 npm install，安装 25 个包，生成 package-lock.json；未链接原 MV 的 node_modules。
- npm test：3 项通过，覆盖翻面切换、确定性动作、歌词时间戳及空白间奏。
- npm run test:browser：成功加载占位纸偶；动作运行；含自定义 PNG 的 JSON 工程导入后保留图片和 241 帧轨迹；实际录制得到非空 VP9 WebM；示例转场不同阶段画面有变化；拒绝静态服务读取 .git；无页面异常。
- npm run render：用独立依赖渲染 1280×720、24 fps、12 秒、288 帧无声 MP4，完整解码通过。
- 从导出视频生成 README 中的演示动图；查看了破碎转场帧，确认旧本子画面碎开、完整双人画面露出。
- 发布目录只包含代码、文档、锁文件和几何示例；不包含本机项目路径、原 MV 音频、歌词及角色。

Windows 已实测；macOS/Linux 和移动浏览器尚未实测。实时 WebM 帧率不是确定性导出的保证；MP4 渲染器按固定时间采样。
