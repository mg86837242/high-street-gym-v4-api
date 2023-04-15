CREATE DATABASE  IF NOT EXISTS `high_street_gym_v5` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `high_street_gym_v5`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: high_street_gym_v5
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `category` enum('Aerobic','Strength','Aerobic & Strength','Flexibility') COLLATE utf8mb4_bin DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `intensityLevel` enum('Low','Medium','High','Very High','Varies with Type') COLLATE utf8mb4_bin DEFAULT NULL,
  `maxPeopleAllowed` int DEFAULT NULL,
  `requirementOne` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `requirementTwo` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `durationMinutes` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin KEY_BLOCK_SIZE=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Yoga','Flexibility','Lorem ipsum','Varies with Type',26,'Large towels are compulsory for Group Exercise and Gym.','BYO mat.',45,60.00),(2,'Pilates','Flexibility','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.','BYO mat.',45,60.00),(3,'Abs','Strength','Lorem ipsum','Very High',26,'Large towels are compulsory for Group Exercise and Gym.','BYO mat.',45,60.00),(4,'HIIT','Aerobic','Lorem ipsum','High',26,'Large towels are compulsory for Group Exercise and Gym.',NULL,45,60.00),(5,'Indoor Cycling','Aerobic','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.',NULL,45,60.00),(6,'Boxing','Aerobic & Strength','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.','BYO boxing gloves, wraps and inner liners.',45,60.00),(7,'Zumba','Aerobic','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.',NULL,45,60.00);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lineOne` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `lineTwo` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `suburb` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `postcode` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `state` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `country` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'1 Ashley St','','Brisbane City','4000','QLD','Australia'),(2,'2 Brooklyn St','','Brisbane City','4000','QLD','Australia'),(3,'3 Carlos St','','Brisbane City','4000','QLD','Australia'),(4,'4 Diamond St','','Brisbane City','4000','QLD','Australia'),(5,'5 Ethan St','','Brisbane City','4000','QLD','Australia'),(6,'6 Frank St','','Brisbane City','4000','QLD','Australia'),(7,'7 Graham St','','Brisbane City','4000','QLD','Australia'),(8,'8 Helena St','','Brisbane City','4000','QLD','Australia'),(9,'195 Leacroft Road',NULL,'Burbank','4156','QLD','Australia'),(10,'35 The Promenade','','Benowa','4217','QLD','Australia'),(11,'46 Victoria Crescent','','Algester','4115','QLD','Australia');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `loginId` int NOT NULL,
  `firstName` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `phone` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `addressId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Managers_Logins1_idx` (`loginId`),
  KEY `fk_Managers_Addresses1_idx` (`addressId`),
  CONSTRAINT `fk_Administrators_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_Administrators_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,1,'Some','Admin','0123456789',1),(2,2,'Another','Admin','0123456789',2),(3,9,'Demo','Admin','0123456789',11);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `body` text COLLATE utf8mb4_bin NOT NULL,
  `loginId` int NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Blogs_Logins1_idx` (`loginId`),
  CONSTRAINT `fk_Blogs_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'Title 1','Lorem Ipsum',1,'2023-04-21 19:09:48',NULL),(2,'Title 2','Lorem Ipsum',3,'2023-04-22 20:09:48',NULL),(3,'Title 3','Lorem Ipsum',5,'2023-04-23 21:09:48',NULL),(4,'New Blog ?','<h2>Hi there,</h2><p>this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p><pre><code class=\"language-css\">body {\n        display: none;\n      }</code></pre><p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p><blockquote><p>Wow, that’s amazing. Good work, boy!</p></blockquote><img class=\"rounded-3xl mx-auto\" src=\"https://images.unsplash.com/photo-1470093851219-69951fcbb533?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1170&amp;q=80\">',9,'2023-04-07 16:37:07','2023-04-10 08:55:35'),(11,'New Blog ?','<h2>\n  Hi there,\n</h2>\n<p>\n  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:\n</p>\n<ul>\n  <li>\n    That’s a bullet list with one …\n  </li>\n  <li>\n    … or two list items.\n  </li>\n</ul>\n<p>\n  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:\n</p>\n<pre><code class=\"language-css\">body {\n  display: none;\n}</code></pre>\n<p>\n  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.\n</p>\n<blockquote>\n  Wow, that’s amazing. Good work, boy!\n</blockquote>',9,'2023-04-10 21:04:59','2023-04-10 21:05:29');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `memberId` int NOT NULL,
  `trainerId` int NOT NULL,
  `activityId` int NOT NULL,
  `dateTime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_member_activity_bookings_members1_idx` (`memberId`),
  KEY `fk_Bookings_Trainers1_idx` (`trainerId`),
  KEY `fk_Bookings_Activities1_idx` (`activityId`),
  CONSTRAINT `fk_Bookings_Activities1` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Bookings_Members1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Bookings_Trainers1` FOREIGN KEY (`trainerId`) REFERENCES `trainers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,1,'2023-04-03 16:00:00'),(2,2,2,2,'2023-04-04 16:00:00'),(3,2,2,3,'2023-04-05 16:00:00'),(4,2,2,4,'2023-04-06 16:00:00'),(5,2,2,5,'2023-04-07 08:00:00'),(6,2,2,6,'2023-04-07 09:00:00'),(7,2,2,7,'2023-04-07 10:00:00'),(8,2,2,1,'2023-04-10 16:00:00'),(9,2,2,2,'2023-04-12 16:00:00'),(10,2,2,3,'2023-04-14 08:00:00'),(11,2,2,4,'2023-04-14 09:00:00'),(12,2,2,5,'2023-04-14 10:00:00'),(13,2,2,6,'2023-04-14 11:00:00'),(14,2,2,7,'2023-04-14 12:00:00'),(15,2,2,1,'2023-04-14 13:00:00'),(16,2,2,2,'2023-04-14 14:00:00'),(17,2,2,3,'2023-04-14 15:00:00'),(18,2,2,4,'2023-04-14 16:00:00'),(19,2,2,5,'2023-04-14 17:00:00'),(20,2,2,6,'2023-04-17 16:00:00'),(21,2,2,7,'2023-04-18 16:00:00'),(22,2,2,1,'2023-04-19 16:00:00'),(23,2,2,2,'2023-04-20 16:00:00'),(24,2,2,3,'2023-04-21 16:00:00'),(25,2,2,4,'2023-04-24 16:00:00'),(26,2,2,5,'2023-04-25 16:00:00'),(27,2,2,6,'2023-04-26 16:00:00'),(28,2,2,7,'2023-04-27 16:00:00'),(29,2,1,1,'2023-04-28 08:00:00'),(30,2,1,2,'2023-04-28 09:00:00'),(31,2,1,3,'2023-04-28 10:00:00'),(36,1,1,1,'2023-04-28 12:00:00');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logins`
--

DROP TABLE IF EXISTS `logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `role` enum('Member','Trainer','Admin','') COLLATE utf8mb4_bin DEFAULT NULL,
  `accessKey` varchar(36) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `authKey_UNIQUE` (`accessKey`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logins`
--

LOCK TABLES `logins` WRITE;
/*!40000 ALTER TABLE `logins` DISABLE KEYS */;
INSERT INTO `logins` VALUES (1,'someadmin@server.com','password','someadmin','Admin',NULL),(2,'anotheradmin@server.com','password','anotheradmin','Admin',NULL),(3,'sometrainer@server.com','password','sometrainer','Trainer',NULL),(4,'anothertrainer@server.com','password','anothertrainer','Trainer',NULL),(5,'somemember@server.com','password','somemember','Member',NULL),(6,'anothermember@server.com','password','anothermember','Member',NULL),(7,'demomember@server.com','$2a$06$d0PUgEQ0leilUtImVVAGu.sFpXXAL5Q7W0FIyudpGxuzPWg7JYTEu','demomember','Member',NULL),(8,'demotrainer@server.com','$2a$06$EG5eqoiqdQd0wNlgRyKRVO7wwlO5z5knAofu1M300b6/ZyOJHEpRm','demotrainer','Trainer',NULL),(9,'demoadmin@server.com','$2a$06$CJ.HykOF/zi7X/xHv1lPx.bLeS0moyffJixlH9iplPEmp6eJasQaW','demoadmin','Admin','f1e499d4-fc99-44a3-bf45-92408011c5db'),(12,'BRn1mIv5C4HQD3xU0-2S-@server.com','$2a$06$PhnKpXL8frgKlbLr..xLLOWzjCM4XCM8hMb//yJXsq6MFXpu2Xpk.','newmember','Member',NULL),(13,'sl2crL6oEBE8eqodOW6uP@server.com','$2a$06$435vqwVmsVULZ9MGlxK46ey.cVAb36AOczfzsQ5gERtZeXXpLyeza','newmember','Member',NULL),(14,'wJLjFa2TBt7RTL7Mw64zN@server.com','$2a$06$g3/0Z4wfUeElBfB7bgPpcO1/d.BCiVhKpRDJIjdEV602WXq2M0OlO','newmember','Member',NULL),(15,'y4kHcs1ecUHvKx4nK3FKp@server.com','$2a$06$MEUo/l7Vm6JwcgIwLsMjDe.o/bqIlSMv92gpHQj47rdKdnO4XQi2q','newmember','Member',NULL),(16,'RjhR6YDr8CQh1IhM7kxIx@server.com','$2a$06$N.QN7dCc.h2a0lM5RkNERO42xPLHtMZrMHkq3C1PjYIUwY8i33dLu','newmember','Member',NULL),(17,'O7hjzv7tcQxNTM2f_cfKF@server.com','$2a$06$KeqSspd6BdtkObxSN5ebr.6hEsW6.d.jcmLuCgrb4Z.9X6SSsIxD.','newmember','Member',NULL),(18,'jsPxs1If7nQ3hbkTWr08t@server.com','$2a$06$ozkMXZBBY9BFQpD78zDno.vOzF/Nd9P2LptAw3q6oLsvpiOzqB4Ci','newmember','Member',NULL),(19,'uAVA1N3Djth3izGpbjMEu@server.com','$2a$06$ULj/Yz1QuxMM7PgZ3mXTH.L50iZ1GyC1WO06qFwRmoC16atMfsF6q','newmember','Member',NULL),(20,'E_2Dyu8gY5KyzmFA0qkvj@server.com','$2a$06$tKGcZML019nUF/vMSIf41OOEIpSAUGQdt9R7fWr1uXrelX50imWFS','newmember','Member',NULL),(21,'z7tDPdrEkLD387_YL4dhT@server.com','$2a$06$J1N/RdUrStOgcm5M5ce8u.jNdw3ePIUiSWM/iYv/lDqhY1Nir.8ty','newmember','Member',NULL),(22,'jeefC21ujF8pfvx5b8cT4@server.com','$2a$06$BlOy.6GwsCPl/nO.hUjfyOw/cm3WUfSoIGKa8PsLzuc1GvayuocWq','newmember','Member',NULL),(23,'ptX4SzKQa3Pc9T5mTeYyx@server.com','$2a$06$AZAIODcDMpvitKusNprsbO02qh5IeR3d/dLW37Efeh5p40OrhnGuS','newmember','Member',NULL),(24,'johndoe@server.com','$2a$06$pfcMpyxsSKhCpQ2QxYLbwOa19gl8GUsRrgdvh1f5QqZQcPDxdA0Cm','johndoe','Member',NULL),(25,'janedoe@server.com','$2a$06$uQz4kbgRAFkRZPZ5ma.qdOqEDOl9YbK3qmoYlpf.YQ8bJ88SaNzCW','janedoe','Member',NULL);
/*!40000 ALTER TABLE `logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `loginId` int NOT NULL,
  `firstName` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `phone` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `addressId` int DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Female','Male','Other') COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_members_specific_traits_users1_idx` (`loginId`),
  KEY `fk_Members_Addresses1_idx` (`addressId`),
  CONSTRAINT `fk_Members_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_Members_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,5,'Some','Member','0123456789',5,25,'Female'),(2,6,'Another','Member','0123456789',6,26,'Male'),(3,7,'Demo','Member','0123456789',9,NULL,NULL),(5,13,'New','Member','0123456789',1,NULL,NULL),(6,14,'New','Member','0123456789',1,NULL,NULL),(7,15,'New','Member','0123456789',1,NULL,NULL),(8,16,'New','Member','0123456789',1,NULL,NULL),(9,17,'New','Member','0123456789',1,NULL,NULL);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainers`
--

DROP TABLE IF EXISTS `trainers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `loginId` int NOT NULL,
  `firstName` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `phone` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `addressId` int DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `specialty` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `certificate` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `imageUrl` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_trainers_specific_traits_users1_idx` (`loginId`),
  KEY `fk_Trainers_Addresses1_idx` (`addressId`),
  CONSTRAINT `fk_Trainers_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_Trainers_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainers`
--

LOCK TABLES `trainers` WRITE;
/*!40000 ALTER TABLE `trainers` DISABLE KEYS */;
INSERT INTO `trainers` VALUES (1,3,'Some','Trainer','0123456789',3,'Lorem ipsum','Aerobatic and physiotherapy','Certificate III in Fitness',NULL),(2,4,'Another','Trainer','0123456789',4,'Lorem ipsum','Strength and physiotherapy','Certificate IV in Fitness',NULL),(3,8,'Demo','Trainer','0123456789',10,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `trainers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-16  8:54:20
