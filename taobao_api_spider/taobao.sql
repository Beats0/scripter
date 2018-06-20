/*
Navicat MySQL Data Transfer

Source Server         : localhost3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : taobao

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-06-20 11:56:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `item_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `userid` int(15) NOT NULL,
  `nick` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `sold` int(15) DEFAULT NULL,
  `shipping` decimal(8,2) NOT NULL,
  `fastPostFee` decimal(8,2) DEFAULT NULL,
  `img2` varchar(255) DEFAULT NULL,
  `location` varchar(15) DEFAULT NULL,
  `area` varchar(15) DEFAULT NULL,
  `commentCount` int(10) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for rate
-- ----------------------------
DROP TABLE IF EXISTS `rate`;
CREATE TABLE `rate` (
  `itemId` bigint(15) NOT NULL,
  `rateId` bigint(15) NOT NULL,
  `rateDate` bigint(13) NOT NULL,
  `rateContent` text,
  `photos` text,
  PRIMARY KEY (`rateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` bigint(15) NOT NULL,
  `nick` varchar(20) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- View structure for select_all
-- ----------------------------
DROP VIEW IF EXISTS `select_all`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost`  VIEW `select_all` AS SELECT
item.item_id,
rate.photos,
rate.rateContent,
rate.rateDate,
rate.rateId,
item.title,
item.userid,
item.nick,
item.price,
item.originalPrice,
item.sold,
item.shipping,
item.fastPostFee,
item.img2,
item.location,
item.area,
item.commentCount
FROM
item
INNER JOIN rate ON item.item_id = rate.itemId
INNER JOIN `user` ON rate.rateId = `user`.userId
WHERE
item.item_id = 529501838768 ;
