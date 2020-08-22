const { readBody } = require("./utils");

async function htmlRewritePlugin({ root, app }) {
  const inject = `
    <script>
        window.process = {};
        process.env = {
            NODE_ENV: 'development'
        }
    </script>
  `;
  // 这里可以给前端注入热更新脚本
  app.use(async (ctx, next) => {
    await next();
    if (ctx.response.is('html')) {
      const html = await readBody(ctx.body);
      // 将script脚本放入到htlml的head标签当中，$&表示保留匹配的结果，在这边就是<head>
      ctx.body = html.replace('<head>', `$&${inject}`)
    }
  });
}
exports.htmlRewritePlugin = htmlRewritePlugin;

// $&表示保留匹配的结果
// let str = `hello`;
// str = str.replace(/hello/, `$&${123}`); // hello123
// console.log(str);