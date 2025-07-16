
/*
Com certeza! Analisei os scripts SQL do seu projeto e o documento de avaliação para criar 5 novas consultas SQL que utilizam subconsultas e podem agregar valor na tomada de decisão para os gestores da "Casa Prado".

Aqui estão as 5 consultas, cada uma com uma breve explicação sobre sua utilidade:

1. Clientes que se cadastraram mas nunca realizaram um pedido
Esta consulta é útil para a equipe de marketing ou vendas, pois identifica clientes em potencial que demonstraram interesse inicial (cadastrando-se) mas que ainda não se tornaram compradores. Com essa lista, é possível criar campanhas de reengajamento ou entrar em contato para oferecer um incentivo.
*/
-- Seleciona os clientes cujo CPF não está na lista de clientes que já fizeram um pedido.
SELECT
    CPF_cliente,
    nome,
    e_mail
FROM
    Cliente
WHERE
    CPF_cliente NOT IN (SELECT DISTINCT CPF_cliente FROM Pedido);
/* retorno:
99988877766	Brendon Lima	brendon.lima@email.com
*/

/*
2. Pedidos com valor total acima da média de todos os pedidos
Esta consulta ajuda os gestores a identificar os pedidos de alto valor. Analisar esses pedidos pode revelar padrões, como tipos de projetos mais lucrativos ou clientes que tendem a gastar mais, auxiliando em estratégias de vendas e na alocação de recursos para garantir a satisfação desses clientes valiosos.
*/

-- Seleciona todos os dados dos pedidos onde o valor_total é maior que a média de valor de todos os pedidos.
-- A subconsulta (SELECT AVG(valor_total) FROM Pedido) calcula o valor médio que é então usado como ponto de comparação.
SELECT
    cod_pedido,
    descricao,
    valor_total,
    CPF_cliente
FROM
    Pedido
WHERE
    valor_total > (SELECT AVG(valor_total) FROM Pedido);

/* retorno:
6	Recepção de clínica	25000.00	55566677788
7	Consultório médico	28000.00	55566677788
*/

/*
3. Projetistas que trabalharam em mais de 2 projetos distintos
Com esta consulta, a gerência pode identificar os projetistas mais ativos ou com maior volume de trabalho. Essa informação é valiosa para avaliações de desempenho, distribuição de novos projetos e para entender a carga de trabalho de cada membro da equipe.
*/

-- Seleciona o nome e o CPF dos projetistas que aparecem em uma subconsulta.
-- A subconsulta agrupa os ambientes por projetista e conta o número de pedidos distintos (projetos) para cada um,
-- filtrando apenas aqueles com mais de 2 projetos.
SELECT
    nome,
    CPF_projetista
FROM
    Projetista
WHERE
    CPF_projetista IN (
        SELECT
            CPF_projetista
        FROM
            Ambiente
        GROUP BY
            CPF_projetista
        HAVING
            COUNT(DISTINCT cod_pedido) > 2
    );
/* retorno vazio 
Ana Oliveira	66677788899
*/

/*
4. Clientes que possuem pedidos com ambientes projetados por mais de um projetista
Identificar clientes que trabalharam com múltiplos projetistas pode indicar grandes projetos (com fases ou ambientes diferentes) ou, em outro cenário, uma possível insatisfação com o projetista original. Em ambos os casos, é uma informação crucial para o gerenciamento de relacionamento com o cliente.
*/
-- Seleciona as informações dos clientes que estão na lista retornada pela subconsulta.
-- A subconsulta junta as tabelas Pedido e Ambiente, agrupando por cliente e contando
-- quantos projetistas distintos estão associados aos seus pedidos. Retorna apenas os clientes com mais de um projetista.
SELECT
    c.nome,
    c.CPF_cliente
FROM
    Cliente c
WHERE
    c.CPF_cliente IN (
        SELECT
            p.CPF_cliente
        FROM
            Pedido p
            JOIN Ambiente a ON p.cod_pedido = a.cod_pedido
        GROUP BY
            p.CPF_cliente
        HAVING
            COUNT(DISTINCT a.CPF_projetista) > 1
    );

/* retorno 
Gabriel Viana	11122233344
Herbert Duarte	55566677788
*/

/*
5. Pedidos que estão sendo gerenciados pelo projetista mais antigo da empresa
Esta consulta pode ser usada para relatórios especiais, para homenagear o trabalho do projetista mais experiente ou para auditar a qualidade e o estilo dos projetos de um profissional de longa data. Ela demonstra como usar uma subconsulta para encontrar um valor específico (neste caso, o CPF do projetista mais antigo) e, em seguida, usar esse valor para filtrar outros dados.
*/

-- Seleciona informações dos pedidos cujo código está na lista retornada pela subconsulta externa.
-- A subconsulta externa busca os códigos de pedido associados ao projetista retornado pela subconsulta interna.
-- A subconsulta interna encontra o CPF do projetista com a data de admissão mais antiga.
SELECT
    p.cod_pedido,
    p.descricao,
    p.valor_total,
    c.nome AS nome_cliente
FROM
    Pedido p
JOIN
    Cliente c ON p.CPF_cliente = c.CPF_cliente
WHERE
    p.cod_pedido IN (
        SELECT
            cod_pedido
        FROM
            Ambiente
        WHERE
            CPF_projetista = (
                SELECT
                    CPF_projetista
                FROM
                    Projetista
                ORDER BY
                    data_admissao ASC -- DESC pode ser útil para medir o desempenho do novato
                LIMIT 1 -- trocar por funcao nativa de calculo de maior valor de data? max talvez?
            )
    );
/* retorno:

1	Projeto cozinha planejada	8500.00	Carlos Silva
4	Home theater para sala	7500.00	Gabriel Viana
*/



