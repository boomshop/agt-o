-- phpMyAdmin SQL Dump
-- version 5.0.4deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 06. Jul 2022 um 12:52
-- Server-Version: 10.5.15-MariaDB-0+deb11u1
-- PHP-Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `agt-o_hemkenrode_2022`
--
CREATE DATABASE IF NOT EXISTS `agt-o_hemkenrode_2022` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `agt-o_hemkenrode_2022`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `config`
--

DROP TABLE IF EXISTS `config`;
CREATE TABLE IF NOT EXISTS `config` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `value` varchar(1024) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- TRUNCATE Tabelle vor dem Einfügen `config`
--

TRUNCATE TABLE `config`;
--
-- Daten für Tabelle `config`
--

INSERT IGNORE INTO `config` (`ID`, `name`, `value`) VALUES
(1, 'started', ''),
(2, 'ended', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `disciplines`
--

DROP TABLE IF EXISTS `disciplines`;
CREATE TABLE IF NOT EXISTS `disciplines` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `type` enum('seconds','points','') DEFAULT NULL,
  `multiplier` float DEFAULT 1,
  `faults` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `progress`
--

DROP TABLE IF EXISTS `progress`;
CREATE TABLE IF NOT EXISTS `progress` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `team` int(11) NOT NULL,
  `discipline` int(11) NOT NULL,
  `state` enum('arrived','progress','left','') NOT NULL,
  `referee` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `referees`
--

DROP TABLE IF EXISTS `referees`;
CREATE TABLE IF NOT EXISTS `referees` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `discipline` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `starters`
--

DROP TABLE IF EXISTS `starters`;
CREATE TABLE IF NOT EXISTS `starters` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) DEFAULT NULL,
  `team` int(11) DEFAULT NULL,
  `birthday` bigint(11) DEFAULT 0,
  `g263` tinyint(1) DEFAULT 0,
  `disclaimer` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `teams`
--

DROP TABLE IF EXISTS `teams`;
CREATE TABLE IF NOT EXISTS `teams` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `image` varchar(1024) DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `paid` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `login` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `role` enum('admin','referee','starter','command','photographer') NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `valuations`
--

DROP TABLE IF EXISTS `valuations`;
CREATE TABLE IF NOT EXISTS `valuations` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `team` int(11) NOT NULL,
  `discipline` int(11) NOT NULL,
  `points` float NOT NULL,
  `penalty` float DEFAULT NULL,
  `reason` varchar(1024) DEFAULT NULL,
  `referee` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
