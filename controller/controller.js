// 控制器
const express = require('express')
const app = express()
const path = require('path')
const controller = {};

controller.index = async (req, res) => {
    res.render(path.join(__dirname, '../views/index.html'))
}

controller.login = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'))
}

controller.classify = (req, res) => {
    res.render(path.join(__dirname, '../views/classify.html'))
}

controller.article = (req, res) => {
    res.render(path.join(__dirname, '../views/article.html'))
}

controller.intercalate = (req, res) => {
    res.render(path.join(__dirname, '../views/intercalate.html'))
}

controller.cs = (req, res) => {
    res.render(path.join(__dirname, '../views/cs.html'))
}

// 添加文章
controller.addArticle = (req, res) => {
    res.render(path.join(__dirname, '../views/addArticle.html'))
}

// 编辑文章
controller.editArticle = (req, res) => {
    res.render(path.join(__dirname, '../views/editArticle.html'))
}

// 暴露
module.exports = controller;