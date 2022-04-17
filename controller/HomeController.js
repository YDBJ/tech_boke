// 导入模型
const query = require('../model/query.js')

const HomeController = {};

// 分类接口
HomeController.cate = async (req, res) => {
    const sql = `select * from classify order by id desc`
    const result = await query(sql)
    res.json(result)
}

// 文章分页接口
HomeController.article = async (req, res) => {
    // 默认1页显示5条数据   没设置默认值会是undefined
    const {
        page = 1, pagesize = 5
    } = req.query;
    // 分页公式
    const offset = (page - 1) * pagesize;
    const sql = `SELECT
        	t1.*, t2.text,
        	t3.username
            FROM
        	article_copy t1
            LEFT JOIN classify t2 ON t1.cat_id = t2.cat_id
            LEFT JOIN account t3 ON t1.author = t3.id
            where t1.status = 1
            ORDER BY t1.id DESC
        limit ${offset},${pagesize}`
    let result = await query(sql)
    // console.log('result', result);
    // 改造result
    result = result.map(item => {
        item.host = 'http://127.0.0.1:3000/' // 加多一个属性 用于前端图片的拼接获取
        return item; // 返回item 即result=item
    })
    res.json(result)
}

// 获取文章详情
HomeController.fetchOneArt = async (req, res) => {
    const {
        id
    } = req.query;
    const sql = `select t1.*,t2.text from article_copy t1 left join classify t2 on t1.cat_id = t2.cat_id where t1.id = ${id}`
    const result = await query(sql);
    res.json(result[0] || {})

}

// 分类列表接口
HomeController.fetchCateArt = async (req, res) => {
    const {
        cate_id
    } = req.query;
    const sql = `select t1.*,t2.text from article_copy t1 left join classify t2 on t1.cat_id = t2.cat_id where t1.cat_id = ${cate_id}`
    let result = await query(sql);
    result = result.map(item => {
        item.host = 'http://127.0.0.1:3000/'
        return item;
    })
    res.json(result)
}

module.exports = HomeController;