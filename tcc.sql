-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2023 at 10:03 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diehardtcc`
--

-- --------------------------------------------------------

--
-- Table structure for table `atributos_principais`
--

CREATE TABLE `atributos_principais` (
  `id_ficha` int(255) NOT NULL,
  `forca` int(5) DEFAULT NULL,
  `destreza` int(5) DEFAULT NULL,
  `constituicao` int(5) DEFAULT NULL,
  `inteligencia` int(5) DEFAULT NULL,
  `sabedoria` int(5) DEFAULT NULL,
  `carisma` int(5) DEFAULT NULL,
  `iniciativa` int(5) DEFAULT NULL,
  `ca` int(5) DEFAULT NULL,
  `prof` int(5) DEFAULT NULL,
  `pv_atual` int(5) DEFAULT NULL,
  `pv_total` int(5) DEFAULT NULL,
  `percepcao` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ficha_jogador`
--

CREATE TABLE `ficha_jogador` (
  `id_ficha` int(255) NOT NULL,
  `id_user` int(255) NOT NULL,
  `personagem` varchar(50) NOT NULL,
  `raca` varchar(50) NOT NULL,
  `classe` varchar(100) NOT NULL,
  `alinhamento` varchar(50) NOT NULL,
  `antecedente` varchar(50) NOT NULL,
  `nivel` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_user` int(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_user`, `nome`, `senha`, `email`) VALUES
(3, 'sadasd', '0', 'dosakdo@gmail.com'),
(2, 'foafoksbow', '0', 'fiejfi@gmail.com'),
(6, 'dfefewfgweg', '0', 'fksofk@gmail.com'),
(1, 'oskdok', '0', 'joao@gmail.com'),
(4, 'sadasd', '0', 'oaksodk@gmail.com'),
(5, 'dafdg', '0', 'sds@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `atributos_principais`
--
ALTER TABLE `atributos_principais`
  ADD PRIMARY KEY (`id_ficha`);

--
-- Indexes for table `ficha_jogador`
--
ALTER TABLE `ficha_jogador`
  ADD PRIMARY KEY (`id_ficha`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_user` (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `atributos_principais`
--
ALTER TABLE `atributos_principais`
  MODIFY `id_ficha` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ficha_jogador`
--
ALTER TABLE `ficha_jogador`
  MODIFY `id_ficha` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_user` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `atributos_principais`
--
ALTER TABLE `atributos_principais`
  ADD CONSTRAINT `FK_id_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `ficha_jogador` (`id_ficha`);

--
-- Constraints for table `ficha_jogador`
--
ALTER TABLE `ficha_jogador`
  ADD CONSTRAINT `ficha_jogador_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
