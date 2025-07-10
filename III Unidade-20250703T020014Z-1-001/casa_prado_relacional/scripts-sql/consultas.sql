# 1. Qual foi o cliente que mais comprou na loja durante todo o período?

SELECT c.CPF_cliente, c.nome, COUNT(p.cod_pedido) AS total_compras, SUM(p.valor_total) AS total_gasto
FROM Cliente c
JOIN Pedido p ON c.CPF_cliente = p.CPF_cliente
GROUP BY c.CPF_cliente, c.nome
ORDER BY total_gasto DESC
LIMIT 1;

# 2. Liste os 2 bairros com maior incidência de entrega dos projetos.

SELECT e.bairro, COUNT(p.cod_pedido) AS total_entregas
FROM Endereco e
JOIN Pedido p ON e.cod_endereco = p.cod_endereco
GROUP BY e.bairro
ORDER BY total_entregas DESC
LIMIT 2;

# 3. Quantos clientes compraram em determinado intervalo de tempo?

SELECT COUNT(DISTINCT CPF_cliente) AS total_clientes
FROM Pedido
WHERE data_prev_entrega BETWEEN '2024-01-01' AND '2024-12-31';


# 4. Existe cliente com reincidência de parcelas em atraso?

SELECT p.CPF_cliente, c.nome, COUNT(par.cod_pagamento) AS parcelas_atrasadas
FROM Cliente c
JOIN Pedido p ON c.CPF_cliente = p.CPF_cliente
JOIN Parcela par ON p.cod_pedido = par.cod_pedido
WHERE par.data_pagamento IS NULL AND par.data_vencimento < CURDATE()
OR (par.data_pagamento IS NOT NULL AND par.data_pagamento > par.data_vencimento)
GROUP BY p.CPF_cliente, c.nome
HAVING COUNT(par.cod_pagamento) > 1;

# 5. Existe algum pedido em atraso? Se sim, qual(is)?

SELECT cod_pedido, descricao, data_prev_entrega, data_entrega, status
FROM Pedido
WHERE data_entrega IS NULL AND data_prev_entrega < CURDATE();


# 6. Quais são os responsáveis pelos 5 projetos mais lucrativos da empresa?

SELECT a.CPF_projetista, proj.nome, SUM(p.valor_total) AS total_valor
FROM Ambiente a
JOIN Pedido p ON a.cod_pedido = p.cod_pedido
JOIN Projetista proj ON a.CPF_projetista = proj.CPF_projetista
GROUP BY a.CPF_projetista, proj.nome
ORDER BY total_valor DESC
LIMIT 5;

# 7. Quantos pedidos estão na assistência técnica?

SELECT COUNT(*) AS total_pedidos_assistencia
FROM Pedido
WHERE status = 'Assistência técnica';


# 8. Algum projetista não vendeu durante determinado período de tempo?

SELECT proj.CPF_projetista, proj.nome
FROM Projetista proj
LEFT JOIN Ambiente a ON proj.CPF_projetista = a.CPF_projetista
LEFT JOIN Pedido p ON a.cod_pedido = p.cod_pedido AND p.data_prev_entrega BETWEEN '2024-07-31' AND '2025-09-30'
WHERE p.cod_pedido IS NULL
GROUP BY proj.CPF_projetista;

# 9. Qual foi a quantidade de ambientes entregues por cada projetista em determinado intervalo de tempo?

SELECT a.CPF_projetista, proj.nome, COUNT(a.cod_ambiente) AS total_ambientes
FROM Ambiente a
JOIN Projetista proj ON a.CPF_projetista = proj.CPF_projetista
JOIN Pedido p ON a.cod_pedido = p.cod_pedido
WHERE p.data_entrega BETWEEN '2024-01-01' AND '2024-12-31' # (Altere as datas conforme necessário)
GROUP BY a.CPF_projetista, proj.nome;


# 10. Qual é o valor total dos pedidos de clientes que não retornaram à loja para comprar mais uma vez?

SELECT SUM(valor_total) AS total_valor
FROM Pedido
WHERE CPF_cliente IN (
    SELECT CPF_cliente
    FROM Pedido
    GROUP BY CPF_cliente
    HAVING COUNT(*) = 1
);