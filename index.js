const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const query = require('./model/query.js')
const session = require('express-session');

// 导入路由模块
const router = require('./router/router.js')
const apiRouter = require('./router/apiRouter.js')



// 解决编辑时req.body返回undefined
var bodyParser = require('body-parser'); //用于req.body获取值的
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({
    extended: true
}));

// 允许跨域
app.use(cors())

// 设置托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 初始化session配置
app.use(session({
    name: 'SessionID', // session会话名称存储在cookie中的键名
    secret: '%#%￥#……%￥', // 必填项，用户session会话加密（防止用户篡改cookie）
    cookie: { //设置session在cookie中的其他选项配置
        path: '/',
        secure: false, //默认为false, true 只针对于域名https协议
        maxAge: 60000 * 60, //设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
    }
}));

// 注册前台路由
app.use('/api', apiRouter)

// 阻止翻墙
app.use((req, res, next) => {
    // 放行的路由
    const not_wall = ['/login', '/join']
    const reqPath = req.path.toLowerCase() // 路径转小写
    // console.log(not_wall.includes(reqPath));
    // console.log('path', req.path);
    if (not_wall.includes(reqPath)) {
        // 存在 放行
        next();
    } else {
        // res.redirect('/login')
        // res.sendFile(path.join(__dirname,'./views/login.html'))
        if (req.session.userInfo) {
            next();
        } else {
            res.redirect('/login')
            return
        }
    }
})

// req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

// art-template 模板引擎
const artTemplate = require('art-template');
const express_template = require('express-art-template');
//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template);
//设置视图引擎为上面的html
app.set('view engine', 'html');

// 引用
app.use(router)

// 数据可视化
// 统计出分类的文章总数
router.get('/cateCount', async (req, res) => {
    let sql = `select count(*) total,t2.text,t1.cat_id
    from article_copy t1 left join classify t2
    on t1.cat_id = t2.cat_id group by  t1.cat_id`;
    let data = await query(sql); // [{},{},{},{}]
    res.json(data)
})

// 统计出当前的每月的文章总数
router.get('/artCount', async (req, res) => {
    let sql = `
    select month(publish_date) month,count(*) as total
    from article_copy
    where year(publish_date) = year(now()) group by month(publish_date)`
    let data = await query(sql);
    res.json(data)
})

app.listen(3000, () => {
    console.log('running');
})