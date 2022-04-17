const fs = require('fs')
const moment = require('moment')
const query = require('../model/query.js');
const express = require('express');
const app = express()
const request = {};
const md5 = require('md5')
const path = require('path')
const {
    promisify
} = require('util');
const rename = promisify(fs.rename)

// req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

// 删除
request.deluser = async (req, res) => {
    let {
        id,
    } = req.query;
    console.log('deluser', req.query);
    const sql = `delete from article where id = ${id}`;
    const rows = await query(sql)
    res.json(rows)
}

// 编辑
request.edit = async (req, res) => {
    console.log('req.body', req.body);
    //1. 接收post参数
    const {
        id,
        title,
        content,
        author,
        status,
        add_time,
        pic,
        cat_id,
    } = req.body;
    //2. 编写sql语句，执行，返回json结果
    sql = `update article set title = '${title}',content = '${content}',author = ${author},status = ${status},
        add_time = '${add_time}',cat_id = '${cat_id}',pic='${pic}' where id = ${id}`;
    rows = await query(sql)
    res.json(rows)
}

// 添加
request.addGoods = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const {
        name,
        intro,
        price,
        prices,
        add_time,
        number
    } = req.body
    const sql = `insert into article(title,content,author,status,add_time,cat_id,pic)
                values('${name}','${intro}',${price},'${prices}','${add_time}','${number}','')`;
    // 执行 sql 语句
    const rows = await query(sql)
    console.log('rows', rows);
    res.json(rows)
}

// 公用头部的请求 公用标题
request.title = async (req, res) => {
    const sql = `select * from title`
    const rows = await query(sql)
    // console.log('title表', rows);
    res.json(rows)
}

// 设置博客系统名
request.inter = async (req, res) => {
    console.log(req.query)
    let {
        name
    } = req.query
    const sql = `update title set val = '${name}' where id = 1`;
    const rows = await query(sql)
    res.json(rows)
}

// 测试的路由
request.css = async (req, res) => {
    const sql = `select * from article`;
    const rows = await query(sql)
    // 必须要符合规范
    res.json({
        code: 0,
        msg: "成功",
        count: 100,
        data: rows
    })
}

// 引入 盐
const {
    password_secret
} = require('../config/config.js');
const {
    SeriesModel
} = require('echarts');
const {
    log
} = require('console');

// 登录
request.join = async (req, res) => {
    let {
        username: u,
        password: p
    } = req.body;
    p = md5(`${p}${password_secret}`)
    const sql = `select * from account where username = '${u}' and password = '${p}'`;
    const rows = await query(sql)
    if (rows[0]) {
        // 成功跳转页面
        // 将信息记录到session
        req.session.userInfo = rows[0];
        // 获取信息数据
        res.cookie('userInfo', JSON.stringify(rows[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: '登录成功'
        })
    } else {
        // 失败则提示用户
        res.json({
            code: -1,
            message: '账号或密码输入错误'
        })
    }
}

// 退出登录
request.quite = (req, res) => {
    // 1. 清除session
    req.session.destroy(function (err) {
        if (err) {
            throw err;
        }
    })
    //2. 响应json
    res.json({
        code: 0,
        message: "已退出"
    })
}

// 上传头像接口
request.avatar = async (req, res) => {
    // 1. 获取用户在session中的信息
    const {
        id
    } = req.session.userInfo;
    // 上传头像后 删除原图
    // 拿到原图的模糊路径
    let oldAvatar = req.session.userInfo.avatar
    console.log(req.session.userInfo.avatar);
    // 拼接原图的路径
    oldAvatar = path.join(path.join(__dirname), oldAvatar)
    console.log(path.join(path.join(__dirname)));
    // 删除原图
    // 判断是否有找到原图片路径
    if (fs.existsSync(oldAvatar)) {
        fs.unlink(oldAvatar, (err) => {
            if (err) throw err;
        })
    }

    // 2. 负责文件上传
    let pic = ''
    if (req.file) {
        // 2. 上传文件得到路径
        let {
            destination,
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;
        try {
            const result = await rename(oldName, newName)
            pic = `../uploads/${filename}${extName}`
            // console.log(result);
            // console.log(pic);
        } catch (err) {
            console.log('上传失败')
        }

        // 上传成功，把路径写到sql语句中，更新到数据库中
        const sql = `update account set avatar = '${pic}' where id = ${id}`
        await query(sql)
        // 取出用户信息，再同步session和cookie中的用户信息
        const sql2 = `select * from account where id = ${id}`
        const result = await query(sql2)
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        console.log('2', req.session.userInfo);
        res.json({
            code: 0,
            message: "avatar success"
        })
    }
}

// 保存信息
request.keep = async (req, res) => {
    // console.log('req.body', req.body);
    let {
        id,
        username,
        intro,
        avatar,
        age
    } = req.body
    // console.log(req.session);
    //2. 编写sql语句，执行，返回json结果
    sql = `update account set username = '${username}',intro = '${intro}', age = '${age}' where id = ${id}`;
    rows = await query(sql)
    // console.log('rows', rows);
    const {
        affectedRows
    } = rows
    if (affectedRows > 0) {
        // 取出用户信息，再同步session和cookie中的用户信息
        const sql = `select * from account where id = ${id}`
        const result = await query(sql)
        console.log(req.session.userInfo);

        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json(req.body)
    }
}

// 文章列表
request.allarticle = async (req, res) => {
    // 1. 接收页码和每页显示的条数
    const {
        page,
        limit,
        keyword
    } = req.query;
    // 2. 查询总记录数
    let sql1 = `select count(id) as count from article_copy where 1 ` // 求和
    if(keyword){
        sql1 += ` and title like '%${keyword}%' `
    }
    const result = await query(sql1)
    const {
        count // 总数
    } = result[0]
    // 3. 根据page和limit获取指定页码的数据
    // 公式：查询起始位置 : （当前页-1）* 每页想显示的条数
    const offset = (page - 1) * limit; // 公式：查询起始位置
    let sql2 = `select t3.username, t1.*, t2.text from article_copy t1 left join classify t2 on t1.cat_id = t2.cat_id 
    LEFT JOIN account t3 on t1.author = t3.id where 1 `  // 查询显示 查询每页显示几条数据
    if(keyword){
        sql2 +=  ` and t1.title like '%${keyword}%' `   
    }
    sql2 += ` order by t1.id desc limit ${offset},${limit}`
    let data = await query(sql2)
    // 4. 响应数据 注意 数据格式
    // console.log('data1', data);
    // map 返回的是一个对象
    data = data.map((item) => {
        // console.log('item', item);
        const {
            id,
            title,
            content,
            cat_id,
            author,
            status,
            publish_date,
            text,
            username
        } = item;
        item.text = text || '未分类' // 所属分类
        item.username = username || '匿名者' // 作者
        item.publish_date = moment(publish_date).format('YYYY-MM-DD HH:mm:ss') //时间
        return item;
    })
    res.json({
        code: 0,
        msg: "sucess",
        data,
        count
    })
}

// 修改密码
request.revise = async (req, res) => {
    // console.log(req.body);
    let {
        id,
        oldpassword,
        newpassword,
        affirmpassword,
        password
    } = req.body;
    oldpassword = md5(`${oldpassword}${password_secret}`)
    if (oldpassword !== password) {
        res.json({
            code: -1,
            lose: '原密码输入错误'
        })
    } else {
        newpassword = md5(`${newpassword}${password_secret}`)
        // console.log(newpassword);
        sql = `update account set password = '${newpassword}' where id = ${id}`;
        rows = await query(sql)
        res.json(req.body)
    }
}

// 文章的删除
request.dlteArticle = async (req, res) => {
    let {
        id,
    } = req.body;
    const sql = `delete from article_copy where id = ${id}`;
    await query(sql)
    res.json(req.body)
}

// 拿到所有的分类
request.classifys = async (req, res) => {
    const sql = `select * from classify`
    let rows = await query(sql)
    // console.log(rows);
    res.json(rows)
}

// 文章提交 添加
request.addArtData = async (req, res) => {
    // 1.接收参数
    const {
        title,
        cate_id,
        status,
        content
    } = req.body;
    const add_date = moment().format('YYYY-MM-DD HH:mm:ss')
    // 2.编写sql语句
    const author = req.session.userInfo.id;
    let pic = '';
    console.log(author);
    // 上传文件
    if (req.file) {
        // 2. 上传文件得到路径
        let {
            destination,
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;
        try {
            const result = await rename(oldName, newName)
            pic = `../uploads/${filename}${extName}`
        } catch (err) {
            console.log('上传失败')
        }
    }
    let sql = `insert into article_copy (title,cat_id,status,content,publish_date,author,pic)
    values('${title}','${cate_id}','${status}','${content}','${add_date}','${author}','${pic}')`
    await query(sql)
    res.json(req.body)
}

// logo设置
request.logoApi = async (req, res) => {
    console.log(req.file);
    let pic = ''
    if (req.file) {
        // 2. 上传文件得到路径
        let {
            destination,
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;
        try {
            const result = await rename(oldName, newName)
            pic = `../uploads/${filename}${extName}`
            console.log('pic', pic);
        } catch (err) {
            console.log('上传失败')
        }
        // 上传成功，把路径写到sql语句中，更新到数据库中
        const sql = `update logo set logo = '${pic}'`
        const rows = await query(sql)
        console.log('rows', rows);
        // 取出用户信息，再同步session和cookie中的用户信息
        // 将信息记录到session或cookie
        // 取出用户信息，再同步session和cookie中的用户信息
        const sql2 = `select * from logo`
        const result = await query(sql2)
        console.log(result[0]);
        // 将信息记录到session或cookie
        req.session.logo = result[0];
        res.cookie('logo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 2 * 3600000),
        })
        res.json({
            code: 0,
            message: "上传logo成功"
        })
    }
}

// 获取文章单条数据的接口
request.fetchOneArt = async (req, res) => {
    // 1. 接收参数
    let {
        id
    } = req.query
    // 2. 查询单条的sql语句
    const sql = `select * from article_copy where id = ${id}`
    const result = await query(sql)
    res.json(result[0])
}

// 更新文章编辑数据
request.updArtData = async (req, res) => {
    console.log(req.body);
    let {
        title,
        status,
        cat_id,
        content,
        id,
        isUpdPic,
        oldPic
    } = req.body;
    //2. 对是否上传文件进行处理
    let pic = '';
    let sql;
    if (isUpdPic == 1) {
        // 上传文件
        let {
            destination,
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;
        try {
            const result = await rename(oldName, newName)
            pic = `../uploads/${filename}${extName}`
            console.log('pic', pic);
        } catch (err) {
            console.log('上传失败')
        }
        // 删除原图
        oldPic = path.join(path.join(__dirname), oldPic)
        console.log('oldPic2', oldPic);
        fs.unlink(oldPic, (err) => {
            if (err) throw err;
        })

        // 上传成功，把路径写到sql语句中，更新到数据库中
        sql = `update article_copy set title = '${title}',content = '${content}',cat_id = '${cat_id}',pic = '${pic}',status = '${status}' where id = ${id} `;
    } else {
        sql = `update article_copy set title = '${title}',content = '${content}',cat_id = '${cat_id}',status = '${status}' where id = ${id} `;
    }
    //3. 执行sql
    const rows = await query(sql)
    console.log('rows', rows);
    res.json({
        code: 0,
        message: "文章编辑成功"
    })
}




module.exports = request;