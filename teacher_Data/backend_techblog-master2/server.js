const express = require('express');
const path = require('path');
const artTemplate = require('art-template');
const express_template = require('express-art-template');

// 导入路由模块中间件
const router = require('./router/router.js')

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template);
//设置视图引擎为上面的html
app.set('view engine', 'html');

// 设置托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(router)

app.listen(3000, () => {
    console.log('server is running at port 3306')
})