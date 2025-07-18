SET SQL_SAFE_UPDATES = 0;

-- Limpeza opcional das tabelas para evitar duplicatas ao executar o script várias vezes
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
-- INSERINDO DADOS BASE + NOVOS DADOS
-- =================================================================================

-- Tabela: Cliente
-- Adicionando os clientes originais e os novos solicitados.
-- Brendon Lima será o cliente que não tem pedidos, para testar a "Consulta 1".
INSERT INTO Cliente (CPF_cliente, nome, data_nascimento, estado_civil, e_mail) VALUES
('12345678901', 'Carlos Silva', '1985-06-15', 'Casado', 'carlos@email.com'),
('98765432100', 'Maria Souza', '1992-03-22', 'Solteiro', 'maria@email.com'),
('00011122233', 'Thallys Viana', '1995-08-20', 'Solteiro', 'thallys.viana@email.com'),
('11122233344', 'Gabriel Viana', '1998-01-15', 'Solteiro', 'gabriel.viana@email.com'),
('55566677788', 'Herbert Duarte', '1991-11-30', 'Casado', 'herbert.duarte@email.com'),
('99988877766', 'Brendon Lima', '2000-05-25', 'Solteiro', 'brendon.lima@email.com'); -- Cliente sem pedidos

-- Tabela: Projetista
-- Adicionando um novo projetista para diversificar as relações.
-- João Mendes é o mais antigo para testar a "Consulta 5".
INSERT INTO Projetista (CPF_projetista, nome, data_admissao, telefone) VALUES
('55544433322', 'João Mendes', '2019-02-10', '77987654333'), -- O mais antigo
('66677788899', 'Ana Oliveira', '2021-05-05', '77987654444'),
('33322211100', 'Ana Karolina', '2022-08-01', '77912345678');

-- Tabela: Endereco
-- Adicionando endereços em Vitória da Conquista.
INSERT INTO Endereco (complemento, bairro, cidade, numero, cep) VALUES
('Apto 101', 'Candeias', 'Vitória da Conquista', '110', '45028000'),
('Casa', 'Recreio', 'Vitória da Conquista', '220', '45020505'),
('Apto 305', 'Centro', 'Vitória da Conquista', '330', '45000190'),
('Sala 50', 'Bela Vista', 'Vitória da Conquista', '440', '45027500');

-- Tabela: ClienteEndereco
-- Relacionando clientes aos seus endereços.
INSERT INTO ClienteEndereco (CPF_cliente, cod_endereco, tipo) VALUES
('12345678901', 1, 'Residencial'),
('98765432100', 2, 'Comercial'),
('00011122233', 3, 'Residencial'),
('11122233344', 1, 'Residencial'),
('55566677788', 4, 'Comercial');

-- Tabela: Pedido
-- Adicionando pedidos que criam cenários para as consultas.
-- Pedidos 6 e 7 possuem valor acima da média para a "Consulta 2".
-- Gabriel Viana (cliente '11122233344') tem os pedidos 4 e 5, para a "Consulta 4".
INSERT INTO Pedido (descricao, data_prev_entrega, data_entrega, status, valor_total, forma_pagamento, tipo_imovel, cod_endereco, CPF_cliente) VALUES
('Projeto cozinha planejada', '2024-07-20', NULL, 'Em produção', 8500.00, 'Pix', 'Residencial', 1, '12345678901'),
('Móveis para escritório', '2024-08-15', NULL, 'Solicitado', 12000.00, 'Boleto', 'Comercial', 2, '98765432100'),
('Quarto de casal completo', '2024-09-10', '2024-09-08', 'Entregue', 9500.00, 'Cartão de crédito', 'Residencial', 3, '00011122233'),
('Home theater para sala', '2024-09-25', NULL, 'Em produção', 7500.00, 'Pix', 'Residencial', 1, '11122233344'),
('Varanda gourmet', '2024-10-05', NULL, 'Em produção', 6800.00, 'Transferência bancária', 'Residencial', 1, '11122233344'),
('Recepção de clínica', '2024-10-20', NULL, 'Solicitado', 25000.00, 'Boleto', 'Comercial', 4, '55566677788'), -- Pedido com valor alto
('Consultório médico', '2024-11-15', NULL, 'Solicitado', 28000.00, 'Boleto', 'Comercial', 4, '55566677788'); -- Pedido com valor alto

-- Tabela: Ambiente
-- Conectando pedidos aos projetistas.
-- Ana Oliveira tem 3 projetos (pedidos 2, 3, 6) para a "Consulta 3".
-- Pedidos 4 e 5 (do cliente Gabriel Viana) são de projetistas diferentes (João e Ana K.) para a "Consulta 4".
-- João Mendes (projetista mais antigo) trabalha no pedido 1 e 4 para a "Consulta 5".
INSERT INTO Ambiente (nome_ambiente, area, CPF_projetista, cod_pedido) VALUES
('Cozinha', 25.50, '55544433322', 1),
('Escritório Central', 40.00, '66677788899', 2),
('Quarto Casal', 20.00, '66677788899', 3),
('Sala de TV', 22.00, '55544433322', 4),
('Varanda', 15.00, '33322211100', 5),
('Recepção', 35.00, '66677788899', 6),
('Consultório', 30.00, '33322211100', 7);


-- Tabela: Parcela
-- Adicionando parcelas para alguns dos novos pedidos.
INSERT INTO Parcela (data_vencimento, data_pagamento, valor_pago, cod_pedido) VALUES
('2024-07-30', NULL, 4250.00, 1),
('2024-08-30', NULL, 4250.00, 1),
('2024-08-20', '2024-08-20', 6000.00, 2),
('2024-09-20', NULL, 6000.00, 2),
('2024-09-15', '2024-09-15', 9500.00, 3),
('2024-10-30', NULL, 12500.00, 6),
('2024-11-30', NULL, 12500.00, 6);


-- Tabela: Versao
-- Adicionando versões de plantas para os novos ambientes.
INSERT INTO Versao (arquivo_planta, cod_ambiente) VALUES
('planta_cozinha_v1.pdf', 1),
('planta_escritorio_v2.pdf', 2),
('planta_quarto_final.pdf', 3),
('planta_hometheater_v1.pdf', 4),
('planta_varanda_v3.pdf', 5),
('planta_recepcao_v1.pdf', 6),
('planta_consultorio_v1.pdf', 7);

SET SQL_SAFE_UPDATES = 1;

