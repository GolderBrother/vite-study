const { readBody } = require('./utils');
const { parse } = require('es-module-lexer'); // 解析import语法的
const Magictring = require('magic-string'); // 因为字符串具有不变性
function rewriteImports(source) {
  const imports = parse(source)[0];
  const magicString = new Magictring(source);
  if (imports.length) { // 如果是imports语句，那就对imports语法进行拦截
    for (let index = 0, len = imports.length; index < len; index++) {
      const { s, e } = imports[index];
      let id = source.substring(s, e);
      // 当前开头不是 . 或者 / 开头的，就不要重写
      // 否则浏览器会抛出这个错误Uncaught TypeError: Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../".
      if (/^[^\.\/]/.test(id)) {
        id = `/@modules/${id}`; // 标识这个模块是第三方模块
        // 修改路径增加 /@modules 前缀
        // 将'vue' 改成 '/@module/vue'
        magicString.overwrite(s, e, id);
      }
    }
  }
  // 将替换后的结果返回
  // 增加/@module 浏览器会再次发送请求，服务器要拦截带有 /@modules 前缀的请求 进行处理
  return magicString.toString();
}
// 对js文件中的 import 语法进行路径的重写，改写后的路径会再次向服务器拦截请求
function moduleRewritePlugin({ app, root }) { // 启动项目时的根路径
  app.use(async (ctx, next) => {
    // 执行中间件
    await next(); // 相当于 ctx.body = fs.createFileStream('xxx')

    // 在这里完善自己的逻辑，koa就是洋葱模型思想
    // 获取到的是文件流，需要将文件流传换成字符串

    // 需要读取js文件内容，将'vue' 改成 '/@module/vue'
    // ctx.response带有is方法，这是koa的语法
    if (ctx.body && ctx.response.is('js')) {
      let content = await readBody(ctx.body);
      // 重写内容，将内容返回回去
      content = rewriteImports(content);
      ctx.body = content;
    }
  });
}

exports.moduleRewritePlugin = moduleRewritePlugin;
