/*
Navicat MariaDB Data Transfer

Source Server         : root
Source Server Version : 100323
Source Host           : localhost:3306
Source Database       : flask1

Target Server Type    : MariaDB
Target Server Version : 100323
File Encoding         : 65001

Date: 2021-02-03 10:44:46
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `adminid` int(11) NOT NULL,
  `admin` varchar(50) NOT NULL,
  `sha1` varchar(70) NOT NULL,
  `create` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('0', '0', '绘梦璃', '1124BBF921B7BE3AF5EEF9F0FD5EC29E2DA3039A9F083BF0C10D41D5D307C60E', '1608877470481');

-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `size` double NOT NULL,
  `eachSize` double NOT NULL,
  `package` int(11) NOT NULL,
  `md5` varchar(50) NOT NULL,
  `path` varchar(255) NOT NULL,
  `userid` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `create` varchar(20) NOT NULL,
  `delete` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES ('0', '66370824_p0.png', '4097629', '4097629', '1', 'b1e854d35f624d9c7ee5c532d0b252a7', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/public/66370824_p0.png.file', '1', '1', '1558613827288', '0');
INSERT INTO `files` VALUES ('1', '第01课.mp4', '16091333', '16091333', '1', '9026f078bc8ebae5d0e036e9f117076e', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/public/file/第01课.mp4.file', '0', '21', '1591845514712', '0');
INSERT INTO `files` VALUES ('2', '杭州刻礼科技有限公司计划书（KL005）.docx', '160493', '160493', '1', 'a1724166347f2fda0e44abc3edef30c5', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/public/杭州刻礼科技有限公司计划书（KL005）.docx.file', '0', '101', '1606803738905', '0');
INSERT INTO `files` VALUES ('3', '201705020621楼听开题报告.docx', '97575', '97575', '1', '01676fc17565a4b556131e4b75c26f4e', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/user/bishe/201705020621楼听开题报告.docx.file', '0', '101', '1609820356347', '0');
INSERT INTO `files` VALUES ('4', '201705020621楼听任务书.docx', '83598', '83598', '1', '9987144b7f907243b12af7360157bdf2', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/user/bishe/201705020621楼听任务书.docx.file', '0', '101', '1609820313499', '0');
INSERT INTO `files` VALUES ('5', '201705020621楼听文件综述.docx', '56091', '56091', '1', 'd916dc9beb4cadf0dee365c46495f191', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/user/bishe/201705020621楼听文件综述.docx.file', '0', '101', '1609820397297', '0');
INSERT INTO `files` VALUES ('6', '201705020621楼听演示.pptx', '701178', '701178', '1', '6d1016a8e96a30626d5e6e3e99baaadb', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/user/bishe/201705020621楼听演示.pptx.file', '0', '101', '1609820090347', '0');
INSERT INTO `files` VALUES ('7', '公司门牌.jpg', '120457', '120457', '1', 'd6b49705675088037fbb3b61e46870e2', '/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/user/test/公司门牌.jpg.file', '4', '1', '1610952175440', '0');

-- ----------------------------
-- Table structure for headphoto
-- ----------------------------
DROP TABLE IF EXISTS `headphoto`;
CREATE TABLE `headphoto` (
  `id` int(11) NOT NULL,
  `headphoto` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of headphoto
-- ----------------------------

-- ----------------------------
-- Table structure for operate
-- ----------------------------
DROP TABLE IF EXISTS `operate`;
CREATE TABLE `operate` (
  `id` int(11) NOT NULL,
  `adminid` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  `time` varchar(20) NOT NULL,
  `host` varchar(40) NOT NULL,
  `else` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of operate
-- ----------------------------

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `key` varchar(50) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of session
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('0', '绘梦璃', 'b37a2ce5755a386a353151e274ca4817', 'admin');
INSERT INTO `users` VALUES ('1', 'a', 'e10adc3949ba59abbe56e057f20f883e', 'basic');
INSERT INTO `users` VALUES ('2', 'hanchang', '202cb962ac59075b964b07152d234b70', 'basic');
INSERT INTO `users` VALUES ('3', '夹竹桃', 'e10adc3949ba59abbe56e057f20f883e', 'basic');
INSERT INTO `users` VALUES ('4', 'test', '098f6bcd4621d373cade4e832627b4f6', 'basic');

-- ----------------------------
-- Table structure for value
-- ----------------------------
DROP TABLE IF EXISTS `value`;
CREATE TABLE `value` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `text` text NOT NULL,
  `userid` int(10) unsigned zerofill NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of value
-- ----------------------------
INSERT INTO `value` VALUES ('0', 'null', '', '0000000000');
INSERT INTO `value` VALUES ('1', '测试上传', '5biM5pyb5rWL6K+V5oiQ5Yqf', '0000000001');
INSERT INTO `value` VALUES ('2', '这是一条新的日记', '5biM5pyb5pyJ5Lq66IO955yL5YiwCui/meS4quaXpeiusOezu+e7nyzlj6rmnInlnKjkuKTmnaHku6XkuIrnmoTml6XorrDmiY3kvJrmmL7npLrlh7rlhoXlrrk=', '0000000001');
INSERT INTO `value` VALUES ('3', '9.3', '5LuK5aSp5pivOS8z77yM576k6YeM6K+05LqGOS8xMuWwseimgeW8gOWtpu+8jOS9huaYr+i/mOayoeWPkemAmuefpeS5pu+8jOi/mOimgeWOu+WtpuagoeaLv+aho+ahiCDnnJ/nmoTmnaXlvpflj4rlkJc=', '0000000002');
INSERT INTO `value` VALUES ('4', '2020年9月4日日记', '546w5Zyo5oiR5piv5YaN5LiA5qyh55qE6YeN5YaZ6L+Z5Liq5pel6K6wCuaVsOaNruW6k+eahOaWh+Wtl+exu+Wei+aIkeW3sue7j+i/nOeoi+i/nuaOpeW5tuS/ruaUuei/h+S6hgrluIzmnJvov5nmrKHmmK/mraPnoa7nmoQK5bm25LiU5YWB6K645oiR6L+Z5qC35aSn6YeP55qE5LiK5Lyg5paH5a2X5Lul5Y+K5YaF5a65CuWFtuWunuaIkeW9k+WIneacgOWlveeahOiuvuaDs+aYr+i/memHjOacrOadpeW6lOivpeWPr+S7peS/neWtmOaWh+S7tgouLi4K566X5LqG5biM5pyb6L+Z5qyh5LiK5Lyg5oiQ5Yqf', '0000000001');
INSERT INTO `value` VALUES ('5', '新的测试上传', '5LmL5YmN5Ly85LmO5piv5pyN5Yqh5Zmo5Ye66Zeu6aKY5LqGCueOsOWcqOmHjeaWsOS7jmdpdOS4i+i9veS6hue9keermeeahOS7o+eggQrnjrDlnKjlupTor6Xlt7Lnu4/msqHmnInpl67popjkuobjgIIK5biM5pyb6L+Z5qyh5LiK5Lyg5LiN5Lya5Ye66ZSZ', '0000000001');
