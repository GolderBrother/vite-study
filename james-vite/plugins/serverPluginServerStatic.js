// 服务端启动一个静态服务的插件
const static = require('koa-static');
const path = require('path');
// 要实现静态服务的功能
function serverStaticPlugin({ app, root }) {
  // 静态服务可以注册n个，在不同的文件夹下注册
  // vite在哪里运行，就以哪个目录启动静态服务
  //  以当前根目录作为静态目录启动服务
  app.use(static(root));
  // 以public作为静态服务
  app.use(static(path.join(root, 'public')));
}

// 解构导出
exports.serverStaticPlugin = serverStaticPlugin;