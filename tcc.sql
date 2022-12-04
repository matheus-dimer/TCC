-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 04-Dez-2022 às 20:50
-- Versão do servidor: 10.4.22-MariaDB
-- versão do PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tcc`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `atributos_principais`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `ficha_jogador`
--

CREATE TABLE `ficha_jogador` (
  `id_ficha` int(255) NOT NULL,
  `id_user` int(255) NOT NULL,
  `personagem` varchar(50) NOT NULL,
  `raca` varchar(50) NOT NULL,
  `alinhamento` varchar(50) NOT NULL,
  `antecedente` varchar(50) NOT NULL,
  `nivel` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_user` int(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `senha` int(100) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `atributos_principais`
--
ALTER TABLE `atributos_principais`
  ADD PRIMARY KEY (`id_ficha`);

--
-- Índices para tabela `ficha_jogador`
--
ALTER TABLE `ficha_jogador`
  ADD PRIMARY KEY (`id_ficha`),
  ADD KEY `id_user` (`id_user`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_user` (`id_user`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `atributos_principais`
--
ALTER TABLE `atributos_principais`
  MODIFY `id_ficha` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `ficha_jogador`
--
ALTER TABLE `ficha_jogador`
  MODIFY `id_ficha` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_user` int(255) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `atributos_principais`
--
ALTER TABLE `atributos_principais`
  ADD CONSTRAINT `FK_id_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `ficha_jogador` (`id_ficha`);

--
-- Limitadores para a tabela `ficha_jogador`
--
ALTER TABLE `ficha_jogador`
  ADD CONSTRAINT `ficha_jogador_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
