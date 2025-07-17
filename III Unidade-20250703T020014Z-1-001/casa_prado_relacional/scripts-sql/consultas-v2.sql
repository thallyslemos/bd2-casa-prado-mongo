/*

1. Projetista com o Maior Ticket Médio (versão com subconsultas aninhadas)
Valor Gerencial: Esta consulta identifica, de forma inequívoca, o projetista de melhor desempenho em termos de valor médio por projeto. É uma métrica poderosa para programas de bônus, reconhecimento e para entender qual perfil de profissional traz mais receita para a empresa.
*/
SELECT
    nome_projetista,
    ticket_medio
FROM
    -- Subconsulta 1: Calcula o ticket médio para cada projetista.
    -- O resultado disso funciona como uma tabela temporária para a consulta principal.
    (SELECT
        proj.nome AS nome_projetista,
        AVG(p.valor_total) AS ticket_medio
    FROM
        Projetista proj
    JOIN
        Ambiente a ON proj.CPF_projetista = a.CPF_projetista
    JOIN
        Pedido p ON a.cod_pedido = p.cod_pedido
    GROUP BY
        proj.nome
    ) AS TabelaTicketMedio
WHERE
    -- A cláusula WHERE filtra o resultado, mantendo apenas a linha
    -- cujo 'ticket_medio' é igual ao valor máximo de 'ticket_medio'.
    TabelaTicketMedio.ticket_medio = (
        -- Subconsulta 2: Encontra o valor máximo do ticket médio.
        -- Esta consulta é executada primeiro para descobrir qual é o maior valor.
        SELECT
            MAX(ticket_medio_interno)
        FROM
            (SELECT
                AVG(p_interno.valor_total) AS ticket_medio_interno
            FROM
                Projetista proj_interno
            JOIN
                Ambiente a_interno ON proj_interno.CPF_projetista = a_interno.CPF_projetista
            JOIN
                Pedido p_interno ON a_interno.cod_pedido = p_interno.cod_pedido
            GROUP BY
                proj_interno.nome
            ) AS TabelaCalculoMaximo
    );

/*
 Ana Karolina	17400.000000
 */

/*
 * 2. Bairro com Maior Incidência de Atrasos na Entrega
Valor Gerencial: Aponta problemas operacionais (logística, montagem) em regiões específicas. Se um bairro tem muitos atrasos, pode ser necessário investigar as equipes que atendem aquela área ou as rotas de entrega, otimizando processos e melhorando a satisfação do cliente.
 */
-- Conta o número de pedidos entregues com atraso para cada bairro.
-- A subconsulta no WHERE filtra apenas os pedidos cujo 'cod_endereco' pertence a um pedido entregue com atraso.
-- Um pedido é considerado atrasado se a data de entrega for posterior à data prevista.
SELECT
    e.bairro,
    COUNT(p.cod_pedido) AS total_de_atrasos
FROM
    Endereco e
JOIN
    Pedido p ON e.cod_endereco = p.cod_endereco
WHERE
    p.cod_pedido IN (
        SELECT
            cod_pedido
        FROM
            Pedido
        WHERE
            data_entrega > data_prev_entrega
    )
GROUP BY
    e.bairro
ORDER BY
    total_de_atrasos DESC;

/*
 Centro	1
 */
-- adicionar mais com atraso

/*
 * 3. Média de Versões de Projeto por Projetista
Valor Gerencial: Esta é uma métrica de eficiência. Um número alto de versões por projeto pode indicar dificuldade do projetista em captar os requisitos do cliente, resultando em retrabalho. Um número baixo pode significar alta assertividade. A gestão pode usar isso para identificar necessidades de treinamento.
*/

-- Calcula a média de versões por projeto para cada projetista.
-- A subconsulta complexa no FROM (chamada 'VersoesPorProjetista') primeiro conta as versões por ambiente,
-- depois agrupa esses ambientes por projetista para obter uma contagem total de versões e projetos.
SELECT
    proj.nome,
    -- A divisão do total de versões pelo total de projetos dá a média de versões por projeto.
    (VersoesPorProjetista.total_versoes / VersoesPorProjetista.total_projetos) AS media_versoes_por_projeto
FROM
    Projetista proj
JOIN
    (SELECT
        a.CPF_projetista,
        COUNT(v.cod_versao) AS total_versoes,
        COUNT(DISTINCT a.cod_pedido) AS total_projetos
    FROM
        Ambiente a
    JOIN
        Versao v ON a.cod_ambiente = v.cod_ambiente
    GROUP BY
        a.CPF_projetista
    ) AS VersoesPorProjetista ON proj.CPF_projetista = VersoesPorProjetista.CPF_projetista
ORDER BY
    media_versoes_por_projeto DESC;
/* saída:
Ana Karolina	1.0000
João Mendes	1.0000
Ana Oliveira	1.0000
 */

 /* OBS: Adicionar ambientes com mais de uma versão e mudar versao para lista simples de strings


/*
4. Clientes que Possuem Parcelas em Atraso
Valor Gerencial: Essencial para a saúde financeira. Esta consulta gera uma lista de ação imediata para a equipe de cobrança, mostrando exatamente quais clientes estão inadimplentes. É o primeiro passo para recuperar receita e mitigar riscos financeiros.
*/
-- Seleciona clientes distintos que possuem parcelas vencidas e não pagas.
-- A subconsulta no WHERE cria uma lista de todos os CPFs de clientes que estão associados
-- a pedidos que, por sua vez, têm parcelas com data de vencimento anterior à data atual (CURDATE())
-- e cuja data de pagamento ainda é NULA.
SELECT
    CPF_cliente,
    nome,
    e_mail
FROM
    Cliente
WHERE
    CPF_cliente IN (
        SELECT DISTINCT p.CPF_cliente
        FROM Pedido p
        JOIN Parcela par ON p.cod_pedido = par.cod_pedido
        WHERE par.data_pagamento IS NULL AND par.data_vencimento < CURDATE()
    );
/* saída:
12345678901	Carlos Silva	carlos@email.com
98765432100	Maria Souza	maria@email.com
55566677788	Herbert Duarte	herbert.duarte@email.com
 */


 /*
  5. Quantidade de Pedidos por Estado Civil do Cliente
Valor Gerencial: Uma consulta valiosa para o marketing e estratégia de produto. Entender qual estado civil mais compra pode direcionar o estilo da comunicação, as promoções e até o tipo de projeto mais ofertado (ex: projetos para "casados" podem ser maiores, enquanto para "solteiros" podem focar em apartamentos menores).
  */

-- Conta o número de pedidos para cada estado civil.
-- A consulta principal agrupa por 'estado_civil'.
-- A subconsulta no FROM cria uma visão que junta o CPF e o estado civil do cliente com cada um de seus pedidos,
-- facilitando a contagem final.
SELECT
    DadosCliente.estado_civil,
    COUNT(DadosCliente.cod_pedido) AS quantidade_de_pedidos
FROM
    (SELECT
        c.estado_civil,
        p.cod_pedido
    FROM
        Cliente c
    JOIN
        Pedido p ON c.CPF_cliente = p.CPF_cliente
    ) AS DadosCliente
GROUP BY
    DadosCliente.estado_civil
ORDER BY
    quantidade_de_pedidos DESC;

/* saída
Solteiro	4
Casado	3
 */

