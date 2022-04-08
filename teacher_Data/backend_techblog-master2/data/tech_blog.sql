/*
Navicat MySQL Data Transfer

Source Server         : 本地主机
Source Server Version : 50553
Source Host           : 127.0.0.1:3306
Source Database       : tech_blog

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2022-04-07 16:02:03
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT '' COMMENT '标题',
  `content` text COMMENT '内容',
  `author` int(11) DEFAULT '0' COMMENT '所属某个用户id',
  `status` tinyint(4) DEFAULT '0' COMMENT '文章状态 0-待审核 1-通过',
  `add_date` datetime DEFAULT NULL COMMENT '添加时间',
  `pic` varchar(200) DEFAULT '' COMMENT '图片封面路径',
  `cate_id` int(11) DEFAULT '0' COMMENT '所属分类的id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cate_id` int(11) NOT NULL AUTO_INCREMENT,
  `cate_name` varchar(30) DEFAULT '',
  `orderBy` int(11) DEFAULT '0' COMMENT '排序字段',
  PRIMARY KEY (`cate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL,
  `password` char(32) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `intro` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
