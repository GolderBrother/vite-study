const moduleREG = /^\/@modules\//;
const fs = require('fs').promises;
const { resolveVue } = require('./utils');
function moduleResolvePlugin({ app, root }) {
  // 根据当前运行vite项目的目录，解析出一个文件表出来，包含着vue中的所有模块
  const vueResolved = resolveVue(root);
  app.use(async (ctx, next) => {
    // 对 /@modules 开头的路径进行映射
    // 处理当前请求的逻辑，是否以 /@modules 开头的
    if (!moduleREG.test(ctx.path)) {
      return next();
    }

    // 去掉 /@modules/路径
    // 将 @modules 替换成真实的vue目录, 其实就是映射到node_modules目录中对应的模块
    const id = ctx.path.replace(moduleREG, '');
    ctx.type = 'js'; // 设置响应类型 相应的结果是js类型 
    // 应该去当前项目下查找 vue 对应的真实的文件
    const content = await fs.readFile(vueResolved[id], 'utf8');
    ctx.body = content; // 返回读取出来的结果
  });
}

exports.moduleResolvePlugin = moduleResolvePlugin;