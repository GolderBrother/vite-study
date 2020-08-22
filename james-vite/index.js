const Koa = require('koa');
// 服务端启动一个静态服务的插件
const { serverStaticPlugin } = require('./plugins/serverPluginServerStatic');
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite');
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve');
const { htmlRewritePlugin } = require('./plugins/serverPluginHtmlRewrite');
// 解析.vue文件
const { vuePlugin } = require('./plugins/serverPluginVue');
function createServer() {
  const app = new Koa();
  // 获取当前目录，在当前目录下启动
  const root = process.cwd();
  const context = {
    app,
    root // 当前根的位置
  }
  // root -> F:xxx/vite-demo 
  // koa中间件的执行顺序 中间件的原理
  const resolvedPlugins = [ // 插件的集合
    // html重写插件, 浏览器中并没有process变量，所以我们需要在html中注入process变量
    htmlRewritePlugin,
    // 先重写路径, 再解析模块
    // (4)解析import， 将vue重写路径为 /vue或./vue或../vue 作为路径前缀，才能发起一个http请求引用资源文件
    moduleRewritePlugin,
    // (3)解析 以 /@modules 文件开头的内容，找到对应的文件内容,返回给游览器
    moduleResolvePlugin,
    // (2) 解析.vue后缀的文件
    vuePlugin,
    // (1)要实现静态服务的功能
    serverStaticPlugin // 功能就是读取静态文件，将文件的结果放到ctx.body上
  ];

  // koa依靠的都是中间件
  // 循环注册插件
  resolvedPlugins.forEach(plugin => plugin(context));
  return app;
}

module.exports = createServer;

// 整体流程
// 浏览器请求vue文件, 如果是不带\.\/路径前缀的, 就会被koa拦截处理, 获取文件内容, 将vue重写成 /@module/vue, 然后再将@module的模块指向node_modules目录下对应的模块, 读取文件内容, 然后返回给浏览器, 浏览器再根据重写后的路径(/@modules/vue),再次发送一个http请求文件资源,此刻又被koa拦截, 直到所有的路径都被替换成浏览器可以请求资源的正确路径

// 主要是处理ESModule模块重写路径的

// process模块在node中有,但是浏览器中没有,需要处理
// window.process = {
//     env: {
//         'NODE_ENV': 'development'
//     }
// };
// 加入到index.html中

// 但是这种方法不方便,因此使用html重写插件来实现

// vite热更新依靠的是websocket的热更新

// 为什么vite启动很快，因为根本没有编译的过程，仅仅是替换路径后再请求资源的操作,而且不需要通过入口把所有的文件都编译一遍

// vite 完全基于ESMdole来实现的, 然后借助浏览器天生的模块能力

// vite的缺点是什么?
// 兼容性不好,热更新有bug

// vite目前还是beta版本

