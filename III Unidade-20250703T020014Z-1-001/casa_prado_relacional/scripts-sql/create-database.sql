CREATE DATABASE IF NOT EXISTS casa_prado;
USE casa_prado;

CREATE TABLE Cliente (
    CPF_cliente VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil ENUM('Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'Separado') NOT NULL,
    e_mail VARCHAR(255) NOT NULL
);

CREATE TABLE Telefone (
    numero VARCHAR(13) NOT NULL,
    CPF_cliente VARCHAR(11) NOT NULL,
    PRIMARY KEY (numero, CPF_cliente),
    FOREIGN KEY (CPF_cliente) REFERENCES Cliente(CPF_cliente)
);

CREATE TABLE Endereco (
    cod_endereco INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    complemento VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    numero VARCHAR(10),
    cep VARCHAR(8) NOT NULL
);

CREATE TABLE ClienteEndereco (
    CPF_cliente VARCHAR(11) NOT NULL,
    cod_endereco INT UNSIGNED NOT NULL,
    tipo ENUM('Residencial', 'Comercial', 'Industrial', 'Institucional') NOT NULL,
    PRIMARY KEY (CPF_cliente, cod_endereco),
    FOREIGN KEY (CPF_cliente) REFERENCES Cliente(CPF_cliente),
    FOREIGN KEY (cod_endereco) REFERENCES Endereco(cod_endereco)
);

CREATE TABLE Pedido (
    cod_pedido INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT NOT NULL,
    data_prev_entrega DATE NOT NULL,
    data_entrega DATE,
    status ENUM('Solicitado', 'Em produção', 'Em instalação', 'Entregue', 'Assistência técnica', 'Finalizado') NOT NULL,
    valor_total DECIMAL(10,2) UNSIGNED NOT NULL,
    forma_pagamento ENUM('Dinheiro', 'Pix', 'Cartão de débito', 'Transferência bancária', 'Boleto', 'Cartão de crédito') NOT NULL,
    tipo_imovel ENUM('Residencial', 'Comercial', 'Industrial', 'Institucional') NOT NULL,
    cod_endereco INT UNSIGNED NOT NULL,
    CPF_cliente VARCHAR(11) NOT NULL,
    FOREIGN KEY (cod_endereco) REFERENCES Endereco(cod_endereco),
    FOREIGN KEY (CPF_cliente) REFERENCES Cliente(CPF_cliente)
);

CREATE TABLE Parcela (
    cod_pagamento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    valor_pago DECIMAL(10,2) UNSIGNED NOT NULL,
    cod_pedido INT UNSIGNED NOT NULL,
    FOREIGN KEY (cod_pedido) REFERENCES Pedido(cod_pedido)
);

CREATE TABLE Projetista (
    CPF_projetista VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_admissao DATE NOT NULL,
    telefone VARCHAR(13) NOT NULL
);

CREATE TABLE Ambiente (
    cod_ambiente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome_ambiente VARCHAR(255) NOT NULL,
    area DECIMAL(7,2) NOT NULL,
    CPF_projetista VARCHAR(11) NOT NULL,
    cod_pedido INT UNSIGNED NOT NULL,
    FOREIGN KEY (CPF_projetista) REFERENCES Projetista(CPF_projetista),
    FOREIGN KEY (cod_pedido) REFERENCES Pedido(cod_pedido)
);

CREATE TABLE Versao (
    cod_versao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    arquivo_planta VARCHAR(255) NOT NULL,
    cod_ambiente INT UNSIGNED NOT NULL,
    FOREIGN KEY (cod_ambiente) REFERENCES Ambiente(cod_ambiente)
);