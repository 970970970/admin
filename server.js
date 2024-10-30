const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { exec } = require('child_process');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');
app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/public', express.static('public'));
app.use('/pages', express.static('pages'));

app.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
})
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/public/config.js', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'config.js'));
});

const server = http.createServer(app);

// 在启动服务器之前运行构建脚本
exec('node build.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行构建脚本时出错: ${error}`);
    return;
  }
  console.log(`构建输出: ${stdout}`);
  if (stderr) {
    console.error(`构建错误: ${stderr}`);
  }

  // 直接启动服务器，不使用reload
  server.listen(app.get('port'), app.get('host'), function () {
    console.log(
      'Web server listening on port http://' + app.get('host') + ':' + app.get('port')
    );
  });
});
