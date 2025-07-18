-- Desativa o modo de atualização segura para permitir a exclusão de dados
SET SQL_SAFE_UPDATES = 0;

-- Limpeza completa das tabelas na ordem correta para evitar erros de chave estrangeira
DELETE FROM Versao;
DELETE FROM Ambiente;
DELETE FROM Parcela;
DELETE FROM Pedido;
DELETE FROM ClienteEndereco;
DELETE FROM Telefone;
DELETE FROM Endereco;
DELETE FROM Projetista;
DELETE FROM Cliente;

-- Resetando o AUTO_INCREMENT para garantir uma sequência limpa
ALTER TABLE Endereco AUTO_INCREMENT = 1;
ALTER TABLE Pedido AUTO_INCREMENT = 1;
ALTER TABLE Parcela AUTO_INCREMENT = 1;
ALTER TABLE Ambiente AUTO_INCREMENT = 1;
ALTER TABLE Versao AUTO_INCREMENT = 1;

-- =================================================================================
-- INSERINDO CONJUNTO DE DADOS ATUALIZADO E AMPLIADO
-- =================================================================================

-- Tabela: Cliente (Adicionando mais diversidade de estado civil)
INSERT INTO Cliente (CPF_cliente, nome, data_nascimento, estado_civil, e_mail) VALUES
('12345678901', 'Carlos Silva', '1985-06-15', 'Casado', 'carlos@email.com'),
('98765432100', 'Maria Souza', '1992-03-22', 'Solteiro', 'maria@email.com'),
('00011122233', 'Thallys Viana', '1995-08-20', 'Solteiro', 'thallys.viana@email.com'),
('11122233344', 'Gabriel Viana', '1998-01-15', 'Solteiro', 'gabriel.viana@email.com'),
('55566677788', 'Herbert Duarte', '1991-11-30', 'Casado', 'herbert.duarte@email.com'),
('99988877766', 'Brendon Lima', '2000-05-25', 'Solteiro', 'brendon.lima@email.com'), -- Cliente sem pedidos
('44455566677', 'Fernanda Lima', '1988-07-12', 'Divorciado', 'fernanda.lima@email.com'),
('88877766655', 'Roberto Alves', '1975-02-28', 'Viúvo', 'roberto.alves@email.com');

-- Tabela: Projetista (Adicionando um novo projetista)
INSERT INTO Projetista (CPF_projetista, nome, data_admissao, telefone) VALUES
('55544433322', 'João Mendes', '2019-02-10', '77987654333'),
('66677788899', 'Ana Oliveira', '2021-05-05', '77987654444'),
('33322211100', 'Ana Karolina', '2022-08-01', '77912345678'),
('10203040506', 'Lucas Farias', '2023-01-20', '77912341234'); -- Novo projetista

-- Tabela: Endereco
INSERT INTO Endereco (complemento, bairro, cidade, numero, cep) VALUES
('Apto 101', 'Candeias', 'Vitória da Conquista', '110', '45028000'),
('Casa', 'Recreio', 'Vitória da Conquista', '220', '45020505'),
('Apto 305', 'Centro', 'Vitória da Conquista', '330', '45000190'),
('Sala 50', 'Bela Vista', 'Vitória da Conquista', '440', '45027500'),
('Loja 02', 'Brasil', 'Vitória da Conquista', '550', '45051105');

-- Tabela: ClienteEndereco
INSERT INTO ClienteEndereco (CPF_cliente, cod_endereco, tipo) VALUES
('12345678901', 1, 'Residencial'), ('98765432100', 2, 'Comercial'),
('00011122233', 3, 'Residencial'), ('11122233344', 1, 'Residencial'),
('55566677788', 4, 'Comercial'), ('44455566677', 5, 'Comercial'),
('88877766655', 2, 'Residencial');

-- Tabela: Pedido (Adicionando pedidos com atraso e de novos clientes)
INSERT INTO Pedido (descricao, data_prev_entrega, data_entrega, status, valor_total, forma_pagamento, tipo_imovel, cod_endereco, CPF_cliente) VALUES
('Projeto cozinha planejada', '2024-07-20', '2024-07-25', 'Entregue', 8500.00, 'Pix', 'Residencial', 1, '12345678901'), -- Atrasado
('Móveis para escritório', '2024-08-15', NULL, 'Solicitado', 12000.00, 'Boleto', 'Comercial', 2, '98765432100'),
('Quarto de casal completo', '2024-09-10', '2024-09-08', 'Entregue', 9500.00, 'Cartão de crédito', 'Residencial', 3, '00011122233'),
('Home theater para sala', '2024-09-25', NULL, 'Em produção', 7500.00, 'Pix', 'Residencial', 1, '11122233344'),
('Varanda gourmet', '2024-10-05', NULL, 'Em produção', 6800.00, 'Transferência bancária', 'Residencial', 1, '11122233344'),
('Recepção de clínica', '2024-10-20', '2024-11-01', 'Entregue', 25000.00, 'Boleto', 'Comercial', 4, '55566677788'), -- Atrasado
('Consultório médico', '2024-11-15', NULL, 'Solicitado', 28000.00, 'Boleto', 'Comercial', 4, '55566677788'),
('Loja de Roupas', '2025-01-10', NULL, 'Solicitado', 18000.00, 'Cartão de crédito', 'Comercial', 5, '44455566677'), -- Cliente Divorciado
('Reforma de Área de Lazer', '2025-02-15', NULL, 'Solicitado', 22000.00, 'Boleto', 'Residencial', 2, '88877766655'), -- Cliente Viúvo
('Pequeno escritório home office', '2025-02-20', '2025-03-01', 'Entregue', 5500.00, 'Pix', 'Residencial', 2, '98765432100'); -- Outro pedido atrasado no Recreio

-- Tabela: Ambiente
INSERT INTO Ambiente (nome_ambiente, area, CPF_projetista, cod_pedido) VALUES
('Cozinha', 25.50, '55544433322', 1), ('Escritório Central', 40.00, '66677788899', 2),
('Quarto Casal', 20.00, '66677788899', 3), ('Sala de TV', 22.00, '55544433322', 4),
('Varanda', 15.00, '33322211100', 5), ('Recepção', 35.00, '66677788899', 6),
('Consultório', 30.00, '33322211100', 7), ('Loja', 50.00, '10203040506', 8),
('Área de Lazer', 60.00, '55544433322', 9), ('Home Office', 12.00, '10203040506', 10);

-- Tabela: Parcela (Adicionando mais parcelas em atraso)
INSERT INTO Parcela (data_vencimento, data_pagamento, valor_pago, cod_pedido) VALUES
('2024-07-30', '2024-07-25', 4250.00, 1), ('2024-08-30', NULL, 4250.00, 1), -- Em atraso
('2024-08-20', '2024-08-20', 6000.00, 2), ('2024-09-20', NULL, 6000.00, 2), -- Em atraso
('2024-09-15', '2024-09-15', 9500.00, 3), ('2024-10-30', '2024-10-28', 12500.00, 6),
('2024-11-30', NULL, 12500.00, 6), -- Em atraso
('2025-02-10', NULL, 9000.00, 8), ('2025-03-10', NULL, 9000.00, 8),
('2025-03-15', NULL, 11000.00, 9), ('2025-04-15', NULL, 11000.00, 9);

-- Tabela: Versao (Adicionando mais versões para variar a média)
INSERT INTO Versao (arquivo_planta, cod_ambiente) VALUES
('planta_cozinha_v1.pdf', 1), ('planta_cozinha_v2_ajustada.pdf', 1), ('planta_escritorio_v2.pdf', 2),
('planta_quarto_final.pdf', 3), ('planta_hometheater_v1.pdf', 4), ('planta_varanda_v3.pdf', 5),
('planta_recepcao_v1.pdf', 6), ('planta_consultorio_v1.pdf', 7), ('planta_loja_v1.pdf', 8),
('planta_lazer_v1.pdf', 9), ('planta_lazer_v2.pdf', 9), ('planta_lazer_v3.pdf', 9),
('planta_homeoffice_v1.pdf', 10);

-- Reativa o modo de atualização segura
SET SQL_SAFE_UPDATES = 1;