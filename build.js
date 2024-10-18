require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('当前工作目录:', process.cwd());
console.log('环境变量:', process.env);

const templatePath = path.join(__dirname, 'public', 'config.template.js');
const configPath = path.join(__dirname, 'public', 'config.js');

console.log('模板文件路径:', templatePath);
console.log('配置文件路径:', configPath);

let template = fs.readFileSync(templatePath, 'utf8');

// 使用正则表达式替换变量
const config = template.replace(/\$\{(\w+)\}/g, (match, p1) => {
    return process.env[p1] || match; // 如果环境变量不存在，保留原始占位符
});

console.log('生成的配置:', config);

fs.writeFileSync(configPath, config);

console.log('Configuration file updated successfully.');
