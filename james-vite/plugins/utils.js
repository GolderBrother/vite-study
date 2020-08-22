const { Readable } = require('stream');
const path = require('path');
async function readBody(stream) {
  // 如果是类型是流才走这个方法, 可读流
  if (stream instanceof Readable) { // 只对流文件进行处理
    return new Promise((resolve, reject) => {
      let res = '';
      stream.on('data', (chunk) => {
        res += chunk;
      });
      stream.on('end', () => resolve(res)); // 将内容解析完成后抛出去
    });
  } else {
    return stream.toString();
  }

}
// 将/@modules 开头的路径解析成对应的真实文件，返回给浏览器
function resolveVue(root) {
  // vue3 由及部分组成 runtime-dom runtime-core compiler reactivity shared compiler-sfc
  // 在后端中解析 .vue 文件
  const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json');
  // 编译的模块使用commonjs规范,其他文件均使用es6模块
  // 编译是在后端实现的，所以我需要拿到的文件是commonjs规范的，,其他文件均使用es6模块
  const compilerPkg = require(compilerPkgPath); // 获取的是json中的内容
  // // 编译模块的路径  node中编译 path.dirname -> 获取的是父路径
  // /node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js
  const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main);
  // @vue/reactivity/dist/reactivity.esm-bundler.js
  const resolvePath = (name) => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`);
  // 核心运行模块
  const runtimeCorePath = resolvePath('runtime-core');
  // dom运行模块
  const runtimeDomPath = resolvePath('runtime-dom'); // @vue/runtime-dom
  // 响应式模块
  const reactivityPath = resolvePath('reactivity');
  // 共享模块
  const sharedPath = resolvePath('shared');
  // 拼字符串，找路径，找映射关系
  // 浏览器 esModule 模块
  // vue所有模块的映射表
  return {
    // 用于稍后后端进行编译的文件路径
    compiler: compilerPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
    vue: runtimeDomPath // vue的入口就是runtimeDom
  }
}
exports.readBody = readBody;
exports.resolveVue = resolveVue;
