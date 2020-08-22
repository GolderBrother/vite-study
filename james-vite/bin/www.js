#! /usr/bin/env node
// 采用node来运行这个脚本，是写死的
const chalk = require('chalk');
const PORT = 4000;
console.log(chalk.cyan('james-vite v1.0.0'));


// 需要通过http启动一个模块，内部是基于koa的

// 创建一个koa的服务
const createServer = require('../index');
createServer().listen(PORT, () => {
  // Dev server running at:
  //     > Network:  http://192.168.8.153:${PORT}/
  //     > Local:    http://localhost:${PORT}/
  console.log(`
        Dev server running at:
        > Local:    http://localhost:${PORT}/
    `);
});
