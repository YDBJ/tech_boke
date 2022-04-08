const path = require('path')

const viewsDir = path.join(path.dirname(__dirname), 'views')

// 导入模型
const query = require('../model/query.js')

const IndexController = {};

IndexController.index = (req, res) => {
    // res.sendFile(`${viewsDir}/index.html`)
    res.render('index.html', {
        age: 18
    })
}


IndexController.login = (req, res) => {
    res.render(`login.html`)
}

IndexController.test = (req, res) => {
    res.render(`test.html`)
}

// api数据接口
IndexController.apiData = (req, res) => {
    const myData = [{
            id: 1,
            title: '111',
            content: '11111',
            author: "显摆",
            status: 0,
            pic: "1.png",
            add_date: "2018",
            cate_id: 1
        },
        {
            id: 2,
            title: '222',
            content: '2222222',
            author: "显摆",
            status: 0,
            pic: "1.png",
            add_date: "2018",
            cate_id: 1
        },
        {
            id: 3,
            title: '333',
            content: '11111',
            author: "显摆",
            status: 0,
            pic: "1.png",
            add_date: "2018",
            cate_id: 1
        },
        {
            id: 4,
            title: '444',
            content: '11111',
            author: "显摆",
            status: 0,
            pic: "1.png",
            add_date: "2018",
            cate_id: 1
        },
        {
            id: 5,
            title: '555',
            content: '11111',
            author: "显摆",
            status: 0,
            pic: "1.png",
            add_date: "2018",
            cate_id: 1
        },
    ]
    res.json({
        code: 0,
        msg: "success",
        count: 100,
        data: myData
    })
}


module.exports = IndexController;