-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 20. Apr 2026 um 20:08
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `shady_shambles`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `actor`
--

CREATE TABLE `actor` (
  `id` int(11) NOT NULL,
  `gold` bigint(20) NOT NULL DEFAULT 0,
  `actor_type` enum('player','merchant') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `actor`
--

INSERT INTO `actor` (`id`, `gold`, `actor_type`) VALUES
(3, 100000000, 'merchant'),
(4, 100000000, 'merchant'),
(5, 100000000, 'merchant'),
(6, 300, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `inventory`
--

CREATE TABLE `inventory` (
  `actor_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `inventory`
--

INSERT INTO `inventory` (`actor_id`, `item_id`, `quantity`) VALUES
(3, 1, 10),
(3, 2, 5),
(3, 3, 3),
(3, 4, 2),
(4, 5, 5),
(4, 6, 3),
(4, 7, 7),
(5, 8, 6),
(5, 9, 2),
(6, 1, 0),
(6, 2, 0),
(6, 3, 0),
(6, 4, 0),
(6, 5, 0),
(6, 6, 0),
(6, 7, 0),
(6, 8, 0),
(6, 9, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `base_value` int(11) NOT NULL,
  `item_type` enum('weapon','potion','gemstone','amulet','armour') NOT NULL,
  `description` varchar(200) NOT NULL,
  `item_sprite` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `item`
--

INSERT INTO `item` (`id`, `name`, `base_value`, `item_type`, `description`, `item_sprite`) VALUES
(1, 'Training Sword', 10, 'weapon', 'Better than fighting with bare hands. Try not to get any splinters...', '/img/items/Training_Sword_300.png'),
(2, 'Rusty Sword', 15, 'weapon', 'A masterpiece of oxidation...If you hit a monster hard enough, a cloud of orange dust might confuse them.', '/img/items/Rusty_Sword_300.png'),
(3, 'Iron Sword', 30, 'weapon', 'Finally, a blade that does not crumble!', '/img/items/Iron_Sword_300.png'),
(4, 'Meteorite Sword', 50, 'weapon', 'Perfectly balanced, unlike your life choices...Makes monsters apologize for existing.', '/img/items/Meteorite_Sword_300.png'),
(5, 'Liquid Courage', 15, 'potion', 'Side effects include temporary bravery and a mild chemical burn...', '/img/items/Liquid_Courage_300.png'),
(6, 'The Green Lion', 40, 'gemstone', 'Legend says it eats gold. In reality, it just sits there looking expensive.', '/img/items/Green_Lion_Gem_300.png'),
(7, 'Rabbit\'s Foot', 25, 'amulet', 'Supposedly brings luck. Did not work out great for the rabbit, though.', '/img/items/Rabbits_Foot_300.png'),
(8, 'Padded Tunic', 10, 'armour', 'Won\'t stop a sword, but it might cushion the fall when you are knocked out.', 'img/items/Padded_Tunic_300.png'),
(9, 'Chainmail', 20, 'armour', 'Great for protection, even better for making a lot of noise while sneaking.', 'img/items/Chainmail_300.png');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `merchant`
--

CREATE TABLE `merchant` (
  `actor_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `merchant_sprite` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `merchant`
--

INSERT INTO `merchant` (`actor_id`, `name`, `merchant_sprite`) VALUES
(3, 'blacksmith', NULL),
(4, 'alchemist', NULL),
(5, 'armourer', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `player`
--

CREATE TABLE `player` (
  `actor_id` int(11) NOT NULL,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `player`
--

INSERT INTO `player` (`actor_id`, `username`, `password`) VALUES
(6, 'Spyro', '$2b$10$kJk4dSpSq34kW2pjnKhK7uxwvRmpZXMHubjlcKw/70WEjYeBf4SLi');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `trading`
--

CREATE TABLE `trading` (
  `id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `price_total` bigint(20) NOT NULL CHECK (`price_total` > 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `trading`
--

INSERT INTO `trading` (`id`, `seller_id`, `buyer_id`, `item_id`, `quantity`, `price_total`, `created_at`) VALUES
(1, 3, 6, 1, 7, 70, '2026-03-23 16:37:29'),
(7, 3, 6, 1, 1, 10, '2026-03-25 16:15:29'),
(8, 6, 3, 1, 2, 20, '2026-03-25 16:15:41'),
(9, 3, 6, 1, 1, 10, '2026-03-26 09:38:07'),
(10, 3, 6, 3, 1, 30, '2026-03-26 09:38:13'),
(11, 6, 3, 1, 7, 70, '2026-03-27 13:13:57'),
(12, 6, 3, 3, 1, 30, '2026-03-27 13:15:00'),
(13, 3, 6, 1, 2, 20, '2026-03-27 13:19:50'),
(14, 6, 3, 1, 2, 20, '2026-03-27 13:20:07'),
(15, 3, 6, 1, 1, 10, '2026-03-27 13:31:17'),
(16, 3, 6, 3, 1, 30, '2026-03-27 13:31:17'),
(17, 6, 3, 1, 1, 10, '2026-03-27 13:31:26'),
(18, 6, 3, 3, 1, 30, '2026-03-27 13:31:26'),
(19, 3, 6, 1, 1, 10, '2026-03-30 19:16:16'),
(20, 3, 6, 2, 1, 15, '2026-03-30 19:16:16'),
(21, 3, 6, 3, 1, 30, '2026-03-30 19:16:16'),
(22, 6, 3, 1, 1, 10, '2026-03-30 19:17:39'),
(23, 6, 3, 2, 1, 15, '2026-03-30 19:17:39'),
(24, 6, 3, 3, 1, 30, '2026-03-30 19:17:39'),
(25, 4, 6, 5, 1, 15, '2026-03-30 19:17:55'),
(26, 4, 6, 6, 1, 40, '2026-03-30 19:17:55'),
(27, 4, 6, 7, 1, 25, '2026-03-30 19:17:55'),
(28, 6, 4, 5, 1, 15, '2026-03-30 19:18:19'),
(29, 6, 4, 6, 1, 40, '2026-03-30 19:18:19'),
(30, 6, 4, 7, 1, 25, '2026-03-30 19:18:19'),
(31, 3, 6, 1, 1, 10, '2026-04-07 11:51:37'),
(32, 3, 6, 2, 1, 15, '2026-04-07 11:51:37'),
(33, 3, 6, 3, 1, 30, '2026-04-07 11:51:37'),
(34, 3, 6, 4, 1, 50, '2026-04-07 11:51:37'),
(35, 6, 3, 4, 1, 50, '2026-04-07 11:52:41'),
(36, 6, 3, 3, 1, 30, '2026-04-07 11:52:41'),
(37, 6, 3, 2, 1, 15, '2026-04-07 11:52:41'),
(38, 6, 3, 1, 1, 10, '2026-04-07 11:52:41'),
(39, 3, 6, 1, 1, 10, '2026-04-07 12:21:30'),
(40, 6, 3, 1, 1, 10, '2026-04-07 12:36:18'),
(41, 3, 6, 1, 1, 10, '2026-04-07 13:13:58'),
(42, 6, 3, 1, 1, 10, '2026-04-07 13:20:41'),
(43, 3, 6, 4, 1, 50, '2026-04-07 13:20:48'),
(44, 3, 6, 4, 1, 50, '2026-04-07 13:20:56'),
(45, 6, 3, 4, 1, 50, '2026-04-07 13:21:02'),
(46, 6, 3, 4, 1, 50, '2026-04-07 13:21:05'),
(47, 3, 6, 1, 1, 10, '2026-04-10 11:43:14'),
(48, 3, 6, 2, 1, 15, '2026-04-10 11:43:14'),
(49, 3, 6, 3, 1, 30, '2026-04-10 11:43:14'),
(50, 5, 6, 8, 1, 10, '2026-04-19 19:06:34'),
(51, 5, 6, 9, 1, 20, '2026-04-19 19:06:34'),
(52, 4, 6, 5, 1, 15, '2026-04-19 19:06:43'),
(53, 4, 6, 6, 1, 40, '2026-04-19 19:06:43'),
(54, 4, 6, 7, 1, 25, '2026-04-19 19:06:43'),
(55, 3, 6, 4, 1, 50, '2026-04-19 19:06:53'),
(56, 3, 6, 1, 3, 30, '2026-04-19 19:07:14'),
(57, 6, 4, 5, 1, 15, '2026-04-19 19:08:09'),
(58, 6, 4, 6, 1, 40, '2026-04-19 19:08:09'),
(59, 6, 4, 7, 1, 25, '2026-04-19 19:08:09'),
(60, 4, 6, 5, 1, 15, '2026-04-19 19:08:23'),
(61, 4, 6, 6, 1, 40, '2026-04-19 19:08:23'),
(62, 4, 6, 7, 1, 25, '2026-04-19 19:08:23'),
(63, 6, 3, 1, 4, 40, '2026-04-20 18:02:02'),
(64, 6, 3, 2, 1, 15, '2026-04-20 18:02:02'),
(65, 6, 3, 3, 1, 30, '2026-04-20 18:02:02'),
(66, 6, 3, 4, 1, 50, '2026-04-20 18:02:02'),
(67, 6, 5, 9, 1, 20, '2026-04-20 18:02:11'),
(68, 6, 5, 8, 1, 10, '2026-04-20 18:02:11'),
(69, 6, 4, 5, 1, 15, '2026-04-20 18:02:17'),
(70, 6, 4, 6, 1, 40, '2026-04-20 18:02:17'),
(71, 6, 4, 7, 1, 25, '2026-04-20 18:02:17');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`actor_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indizes für die Tabelle `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `merchant`
--
ALTER TABLE `merchant`
  ADD PRIMARY KEY (`actor_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indizes für die Tabelle `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`actor_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indizes für die Tabelle `trading`
--
ALTER TABLE `trading`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `item_id` (`item_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `actor`
--
ALTER TABLE `actor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `trading`
--
ALTER TABLE `trading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `merchant`
--
ALTER TABLE `merchant`
  ADD CONSTRAINT `merchant_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `trading`
--
ALTER TABLE `trading`
  ADD CONSTRAINT `trading_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `actor` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `trading_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `actor` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `trading_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
