const path = require('path')
const CateController = {};

// 导入模型
const query = require('../model/query.js')


CateController.index = (req, res) => {
    res.render(`catelist.html`)
}

// 分类接口数据
CateController.cateData = async (req, res) => {
    // 1.编写sql 查询数据
    const sql = 'select * from category';
    const data = await query(sql)
    // 2.返回json数据（规范）给前端
    const responseData = {
        data,
        code: 0,
        msg: "success"
    }
    res.json(responseData)
}

CateController.updCateData = async (req, res) => {
    //1. 接收post参数
    const {
        cate_id,
        cate_name,
        orderBy
    } = req.body;
    //2. 编写sql语句，执行，返回json结果
    const sql = `update category set cate_name = '${cate_name}',orderBy = ${orderBy} 
    where cate_id = ${cate_id}`;
    const {
        affectedRows
    } = await query(sql)
    const successData = {
        code: 0,
        message: "update success"
    }
    const failData = {
        code: 1,
        message: "fail success"
    }

    if (affectedRows > 0) {
        res.json(successData)
    } else {
        res.json(failData)
    }
}

module.exports = CateController;