-- MySQL dump 10.17  Distrib 10.3.23-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: flask1
-- ------------------------------------------------------
-- Server version	10.3.23-MariaDB-0+deb10u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `adminid` int(11) NOT NULL,
  `admin` varchar(50) NOT NULL,
  `sha1` varchar(70) NOT NULL,
  `create` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (0,0,'绘梦璃','1124BBF921B7BE3AF5EEF9F0FD5EC29E2DA3039A9F083BF0C10D41D5D307C60E','1608877470481');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (0,'66370824_p0.png',4097629,4097629,1,'b1e854d35f624d9c7ee5c532d0b252a7','/root/Desktop/huimengli/Flask1/Flask1/Flask1/root/public/66370824_p0.png.file',1,101,'1558613827288',0);
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `headphoto`
--

DROP TABLE IF EXISTS `headphoto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `headphoto` (
  `id` int(11) NOT NULL,
  `headphoto` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `headphoto`
--

LOCK TABLES `headphoto` WRITE;
/*!40000 ALTER TABLE `headphoto` DISABLE KEYS */;
/*!40000 ALTER TABLE `headphoto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operate`
--

DROP TABLE IF EXISTS `operate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operate` (
  `id` int(11) NOT NULL,
  `adminid` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  `time` varchar(20) NOT NULL,
  `host` varchar(40) NOT NULL,
  `else` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operate`
--

LOCK TABLES `operate` WRITE;
/*!40000 ALTER TABLE `operate` DISABLE KEYS */;
/*!40000 ALTER TABLE `operate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `key` varchar(50) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'绘梦璃','b37a2ce5755a386a353151e274ca4817','admin'),(1,'a','e10adc3949ba59abbe56e057f20f883e','basic'),(2,'hanchang','202cb962ac59075b964b07152d234b70','basic'),(3,'夹竹桃','e10adc3949ba59abbe56e057f20f883e','basic');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `value`
--

DROP TABLE IF EXISTS `value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `value` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `text` text NOT NULL,
  `userid` int(10) unsigned zerofill NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `value`
--

LOCK TABLES `value` WRITE;
/*!40000 ALTER TABLE `value` DISABLE KEYS */;
INSERT INTO `value` VALUES (0,'null','',0000000000),(1,'测试上传','5biM5pyb5rWL6K+V5oiQ5Yqf',0000000001),(2,'这是一条新的日记','5biM5pyb5pyJ5Lq66IO955yL5YiwCui/meS4quaXpeiusOezu+e7nyzlj6rmnInlnKjkuKTmnaHku6XkuIrnmoTml6XorrDmiY3kvJrmmL7npLrlh7rlhoXlrrk=',0000000001),(3,'9.3','5LuK5aSp5pivOS8z77yM576k6YeM6K+05LqGOS8xMuWwseimgeW8gOWtpu+8jOS9huaYr+i/mOayoeWPkemAmuefpeS5pu+8jOi/mOimgeWOu+WtpuagoeaLv+aho+ahiCDnnJ/nmoTmnaXlvpflj4rlkJc=',0000000002),(4,'2020年9月4日日记','546w5Zyo5oiR5piv5YaN5LiA5qyh55qE6YeN5YaZ6L+Z5Liq5pel6K6wCuaVsOaNruW6k+eahOaWh+Wtl+exu+Wei+aIkeW3sue7j+i/nOeoi+i/nuaOpeW5tuS/ruaUuei/h+S6hgrluIzmnJvov5nmrKHmmK/mraPnoa7nmoQK5bm25LiU5YWB6K645oiR6L+Z5qC35aSn6YeP55qE5LiK5Lyg5paH5a2X5Lul5Y+K5YaF5a65CuWFtuWunuaIkeW9k+WIneacgOWlveeahOiuvuaDs+aYr+i/memHjOacrOadpeW6lOivpeWPr+S7peS/neWtmOaWh+S7tgouLi4K566X5LqG5biM5pyb6L+Z5qyh5LiK5Lyg5oiQ5Yqf',0000000001),(5,'新的测试上传','5LmL5YmN5Ly85LmO5piv5pyN5Yqh5Zmo5Ye66Zeu6aKY5LqGCueOsOWcqOmHjeaWsOS7jmdpdOS4i+i9veS6hue9keermeeahOS7o+eggQrnjrDlnKjlupTor6Xlt7Lnu4/msqHmnInpl67popjkuobjgIIK5biM5pyb6L+Z5qyh5LiK5Lyg5LiN5Lya5Ye66ZSZ',0000000001);
/*!40000 ALTER TABLE `value` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-28  1:00:29
