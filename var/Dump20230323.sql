CREATE DATABASE  IF NOT EXISTS `high_street_gym_v4` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `high_street_gym_v4`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: high_street_gym_v4
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
  `name` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `category` enum('Aerobic','Strength','Aerobic & Strength','Flexibility') COLLATE utf8mb3_bin DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `intensityLevel` enum('Low','Medium','High','Very High','Varies with Type') COLLATE utf8mb3_bin NOT NULL,
  `maxPeopleAllowed` int DEFAULT NULL,
  `requirementOne` varchar(100) COLLATE utf8mb3_bin DEFAULT NULL,
  `requirementTwo` varchar(100) COLLATE utf8mb3_bin DEFAULT NULL,
  `durationMinutes` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Yoga','Flexibility','Lorem ipsum','Varies with Type',26,'Large towels are compulsory for Group Exercise and Gym.','BYO mat.',45,60.00),(2,'Pilates','Flexibility','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.','BYO mat.',45,60.00),(3,'Abs','Strength','Lorem ipsum','Very High',26,'Large towels are compulsory for Group Exercise and Gym.','BYO mat.',45,60.00),(4,'HIIT','Aerobic','Lorem ipsum','High',26,'Large towels are compulsory for Group Exercise and Gym.',NULL,45,60.00),(5,'Indoor Cycling','Aerobic','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.',NULL,45,60.00),(6,'Boxing','Aerobic & Strength','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.','BYO boxing gloves, wraps and inner liners.',45,60.00),(7,'Zumba','Aerobic','Lorem ipsum','Medium',26,'Large towels are compulsory for Group Exercise and Gym.','',45,60.00);
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
  `lineOne` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `lineTwo` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `suburb` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `postcode` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `state` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `country` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'1 Amber St','','Brisbane City','4000','QLD','Australia'),(2,'2 Brooklyn St','','Brisbane City','4000','QLD','Australia'),(3,'3 Christine St','','Brisbane City','4000','QLD','Australia'),(4,'4 Diamond St','','Brisbane City','4000','QLD','Australia'),(5,'5 Emblem St','','Brisbane City','4000','QLD','Australia'),(6,'6 Frank St','','Brisbane City','4000','QLD','Australia'),(7,'7 Golden St','','Brisbane City','4000','QLD','Australia'),(8,'8 Helena St','','Brisbane City','4000','QLD','Australia'),(19,'195 Leacroft Road','','Burbank','4156','QLD','Australia'),(20,'35 The Promenade','','Benowa','4217','QLD','Australia'),(24,'46 Victoria Crescent','','Algester','4115','QLD','Australia');
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
  `firstName` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `phone` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `addressId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Managers_Logins1_idx` (`loginId`),
  KEY `fk_Managers_Addresses1_idx` (`addressId`),
  CONSTRAINT `fk_Administrators_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_Administrators_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,1,'Some','Admin','0123456789',1),(2,2,'Another','Admin','0123456789',2),(3,27,'Demo','Admin','0123456789',24);
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
  `memberId` int NOT NULL,
  `title` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `body` varchar(6000) COLLATE utf8mb3_bin NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Blogs_MemberSpTraits1_idx` (`memberId`),
  CONSTRAINT `fk_Blogs_Members1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,1,'Title 1','Lorem Ipsum',NULL,NULL),(2,2,'Title 2','Lorem Ipsum',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,1,'2023-03-01 16:00:00'),(2,2,2,2,'2023-03-03 16:00:00'),(3,2,2,3,'2023-03-06 16:00:00'),(4,2,2,4,'2023-03-07 08:00:00'),(5,2,2,5,'2023-03-07 09:00:00'),(6,2,2,6,'2023-03-07 10:00:00'),(7,2,2,7,'2023-03-07 11:00:00'),(8,2,2,1,'2023-03-08 16:00:00'),(9,2,2,2,'2023-03-09 16:00:00'),(10,2,2,3,'2023-03-10 08:00:00'),(11,2,2,4,'2023-03-10 09:00:00'),(12,2,2,5,'2023-03-10 10:00:00'),(13,2,2,6,'2023-03-10 11:00:00'),(14,2,2,7,'2023-03-10 12:00:00'),(15,2,2,1,'2023-03-10 13:00:00'),(16,2,2,2,'2023-03-10 14:00:00'),(17,2,2,3,'2023-03-10 15:00:00'),(18,2,2,4,'2023-03-10 16:00:00'),(19,2,2,5,'2023-03-10 17:00:00'),(20,2,2,6,'2023-03-13 16:00:00'),(21,2,2,7,'2023-03-14 16:00:00'),(22,2,2,1,'2023-03-15 16:00:00'),(23,2,2,2,'2023-03-16 16:00:00'),(24,2,2,3,'2023-03-17 16:00:00'),(25,2,2,4,'2023-03-20 16:00:00'),(26,2,2,5,'2023-03-21 16:00:00'),(27,2,2,6,'2023-03-22 16:00:00'),(28,2,2,7,'2023-03-23 16:00:00'),(29,2,1,1,'2023-03-24 08:00:00'),(30,2,1,2,'2023-03-24 09:00:00'),(31,2,1,3,'2023-03-24 10:00:00'),(32,1,1,1,'2023-03-24 16:00:00');
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
  `email` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `password` varchar(100) COLLATE utf8mb3_bin NOT NULL,
  `username` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `role` enum('Member','Trainer','Admin','') COLLATE utf8mb3_bin DEFAULT NULL,
  `accessKey` varchar(36) COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `authKey_UNIQUE` (`accessKey`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logins`
--

LOCK TABLES `logins` WRITE;
/*!40000 ALTER TABLE `logins` DISABLE KEYS */;
INSERT INTO `logins` VALUES (1,'jadoe@server.com','password','jadoe','Admin',NULL),(2,'jbdoe@server.com','password','jbdoe','Admin',NULL),(3,'jcdoe@server.com','password','jcdoe','Trainer',NULL),(4,'jddoe@server.com','password','jddoe','Trainer',NULL),(5,'jedoe@server.com','password','jedoe','Member',NULL),(6,'jfdoe@server.com','password','jfdoe','Member',NULL),(21,'demomember@gmail.com','$2a$06$LKcMZ5m20oomNJVvC0slSOFuejoYyh/j6MdHPP3bFtNcdo3keWSKe','demomember','Member',NULL),(23,'demotrainer@gmail.com','$2a$06$0AVY2juB2jXFHrGPpp9IUOQ1AYk.qrdspw1q.8Iw9j7NtPKnYVidm','demotrainer','Trainer','f292182f-763c-4990-8d46-faf3a40ddbf4'),(27,'demoadmin@gmail.com','$2a$06$8epaVqbKmM.b4NlmE7J3IOi7Ile6gLmCMG1NTvd/mbxlPWlE.0isS','demoadmin','Admin',NULL);
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
  `firstName` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `phone` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `addressId` int DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Female','Male','Other') COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_members_specific_traits_users1_idx` (`loginId`),
  KEY `fk_Members_Addresses1_idx` (`addressId`),
  CONSTRAINT `fk_Members_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_Members_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,5,'Ja','Doe','0123456789',5,25,'Female'),(2,6,'Jb','Doe','0123456789',6,26,'Male'),(9,21,'Demo','Member','0123456789',19,26,NULL);
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
  `firstName` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `phone` varchar(45) COLLATE utf8mb3_bin NOT NULL,
  `addressId` int DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `specialty` varchar(45) COLLATE utf8mb3_bin DEFAULT NULL,
  `certificate` varchar(45) COLLATE utf8mb3_bin DEFAULT NULL,
  `imageUrl` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_trainers_specific_traits_users1_idx` (`loginId`),
  KEY `fk_Trainers_Addresses1_idx` (`addressId`),
  CONSTRAINT `fk_Trainers_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_Trainers_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainers`
--

LOCK TABLES `trainers` WRITE;
/*!40000 ALTER TABLE `trainers` DISABLE KEYS */;
INSERT INTO `trainers` VALUES (1,3,'Some','Trainer','0123456789',3,'Lorem ipsum','Aerobatic and physiotherapy','Certificate III in Fitness',NULL),(2,4,'Another','Trainer','0123456789',4,'Lorem ipsum','Strength and physiotherapy','Certificate IV in Fitness',NULL),(11,23,'Demo','Trainer','0123456789',20,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `trainers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'high_street_gym_v4'
--

--
-- Dumping routines for database 'high_street_gym_v4'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-24 20:07:33
