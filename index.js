const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// art-template
const artTemplate = require('art-template');
const express_template = require('express-art-template');
//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template);
//设置视图引擎为上面的html
app.set('view engine', 'html');


// 允许跨域
app.use(cors())

// 导入路由模块
const router = require('./router/router.js')
const {
    send
} = require('process')
// 引用
app.use(router)

// req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

// 设置托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// 分类列表
app.get('/classify', (req, res) => {
    res.render(path.join(__dirname, './views/classify.html'))
})

// 文章列表
app.get('/article', (req, res) => {
    res.render(path.join(__dirname, './views/article.html'))
})

const query = require('./model/query.js')
// 获取数据库的分类表数据
app.post('/sql', async (req, res) => {
    const sql = 'select * from article'
    const rows = await query(sql)
    res.json(rows)
})
// 测试 （已应用）
app.get('/cs', (req, res) => {
    res.render(path.join(__dirname, './views/cs.html'))
})
app.get('/css', async (req, res) => {
    const sql = `select * from article`;
    const rows = await query(sql)
    // 必须要符合规范
    res.json({
        code: 0,
        msg: "成功",
        count: 100,
        data: rows
    })
})

app.post('/edit', async (req, res) => {
    //1. 接收post参数
    const {
        id,
        title,
        content,
        author,
        status,
        add_time,
        pic,
        cate_id,
    } = req.body;
    //2. 编写sql语句，执行，返回json结果
    sql = `update article set 
        title = '${title}',content = '${content}',author = ${author},status = ${status},
        add_time = '${add_time}',cate_id = '${cate_id}',pic = '${pic}' where id = ${id}`;
    rows = await query(sql)
    res.json(rows)
})

app.get('/deluser', async (req, res) => {
    console.log(req.query);
    let {
        id,
    } = req.query;
    const sql = `delete from article where id = ${id}`;
    const rows = await query(sql)
    res.json(rows)
})

app.listen(3000, () => {
    console.log('running');
})