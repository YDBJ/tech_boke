const path = require('path')
const IndexController = {};

// 导入模型
const viewsDir = path.join(path.dirname(__dirname), 'views')
const query = require('../model/query.js')

IndexController.index = (req, res) => {
    res.sendFile(`${viewsDir}/index.html`)
}

IndexController.login = (req, res) => {
    res.sendFile(`${viewsDir}/login.html`)
}

module.exports = IndexController;