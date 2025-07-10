-- Inserindo Clientes
INSERT INTO Cliente (CPF_cliente, nome, data_nascimento, estado_civil, e_mail) VALUES
('12345678901', 'Carlos Silva', '1985-06-15', 'Casado', 'carlos@email.com'),
('98765432100', 'Maria Souza', '1992-03-22', 'Solteiro', 'maria@email.com'),
('00011122233', 'João Duarte', '1992-03-22', 'Casado', 'joao@email.com');

-- Inserindo Telefones
INSERT INTO Telefone (numero, CPF_cliente) VALUES
('11987654321', '12345678901'),
('21987654321', '98765432100');

-- Inserindo Endereços
INSERT INTO Endereco (complemento, bairro, cidade, numero, cep) VALUES
('Apto 101', 'Centro', 'São Paulo', '100', '01001000'),
('Casa', 'Bela Vista', 'Rio de Janeiro', '200', '20020020');

-- Relacionando Clientes com Endereços
INSERT INTO ClienteEndereco (CPF_cliente, cod_endereco, tipo) VALUES
('12345678901', 1, 'Residencial'),
('98765432100', 2, 'Comercial');

-- Inserindo Pedidos
INSERT INTO Pedido (descricao, data_prev_entrega, data_entrega, status, valor_total, forma_pagamento, tipo_imovel, cod_endereco, CPF_cliente, cod_pedido) VALUES
('Projeto para reforma de apartamento', '2024-07-20', NULL, 'Assistência técnica', 5000.00, 'Pix', 'Residencial', 1, '12345678901', 1),
('Projeto para reforma de apartamento 2', '2024-07-20', '2024-07-10', 'Solicitado', 5000.00, 'Pix', 'Residencial', 1, '12345678901', 2),
('Projeto para reforma de apartamento 3', '2024-07-20', NULL, 'Solicitado', 5000.00, 'Pix', 'Residencial', 1, '12345678901', 3),
('Projeto para reforma de apartamento 4', '2024-07-20', '2024-07-10', 'Solicitado', 5000.00, 'Pix', 'Residencial', 1, '00011122233', 4),
('Construção de escritório', '2024-08-15', '2024-08-15', 'Em produção', 12000.00, 'Transferência bancária', 'Comercial', 2, '98765432100', 5);


-- Inserindo Parcelas
INSERT INTO Parcela (data_vencimento, data_pagamento, valor_pago, cod_pedido) VALUES
('2024-07-25', '2024-07-27', 2500.00, 1),
('2024-08-25', '2024-08-27', 2500.00, 1),
('2024-09-25', NULL, 2500.00, 1),
('2024-08-25', NULL, 6000.00, 2);

-- Inserindo Projetistas
INSERT INTO Projetista (CPF_projetista, nome, data_admissao, telefone) VALUES
('55544433322', 'João Mendes', '2020-02-10', '11987654333'),
('66677788899', 'Ana Oliveira', '2021-05-05', '21987654444');

-- Inserindo Ambientes
INSERT INTO Ambiente (nome_ambiente, area, CPF_projetista, cod_pedido, cod_ambiente) VALUES
('Sala de estar', 30.50, '55544433322', 1, 1),
('Escritório Principal', 50.00, '66677788899', 2, 2);

-- Inserindo Versões
INSERT INTO Versao (arquivo_planta, cod_ambiente) VALUES
('planta_sala.pdf', 1),
('planta_escritorio.pdf', 2);



