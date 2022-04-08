const path = require('path')
const ArtController = {};

// 导入模型
const viewsDir = path.join(path.dirname(__dirname), 'views')
const query = require('../model/query.js')


ArtController.index = (req, res) => {
    res.render(`articlelist.html`)
}

module.exports = ArtController;