// Script com as 5 consultas obrigatórias para o MongoDB
// Conexão com o banco de dados "casa_prado"
use("casa_prado")

// Definição da data atual para as consultas. No SQL, usa-se CURDATE().
// Aqui, definimos uma data fixa para que as consultas sejam consistentes.
const hoje = new Date("2024-09-30T00:00:00Z"); 
print(`Data usada para as consultas: ${hoje.toISOString()}`);

// --------------------------------------------------------
print("\n--- Consulta 1: Qual foi o cliente que mais comprou na loja durante todo o período? ---");
// SQL Equivalente:
// SELECT c.CPF_cliente, c.nome, SUM(p.valor_total) AS total_gasto
// FROM Cliente c JOIN Pedido p ON c.CPF_cliente = p.CPF_cliente
// GROUP BY c.CPF_cliente, c.nome ORDER BY total_gasto DESC LIMIT 1;

print(
    db.pedidos.aggregate([
  // Etapa 1: Agrupar os pedidos pelo ID do cliente e somar o valor total de cada um.
  {
    $group: {
      _id: "$cliente_id",
      total_gasto: { $sum: "$valor_total" }
    }
  },
  // Etapa 2: Ordenar o resultado em ordem decrescente pelo total gasto.
  {
    $sort: {
      total_gasto: -1
    }
  },
  // Etapa 3: Limitar o resultado ao primeiro documento (o maior gastador).
  {
    $limit: 1
  },
  // Etapa 4 (Opcional, mas recomendado): Juntar com a coleção 'clientes' para obter o nome.
  {
    $lookup: {
      from: "clientes",
      localField: "_id",
      foreignField: "_id",
      as: "info_cliente"
    }
  },
  // Etapa 5: Formatar a saída para mostrar os dados de forma mais limpa.
  {
    $project: {
      _id: 0,
      CPF_cliente: "$_id",
      nome_cliente: { $arrayElemAt: ["$info_cliente.nome", 0] },
      total_gasto: "$total_gasto"
    }
  }
]))


// --------------------------------------------------------
print("\n--- Consulta 2: Liste os 2 bairros com maior incidência de entrega dos projetos. ---");
// SQL Equivalente:
// SELECT e.bairro, COUNT(p.cod_pedido) AS total_entregas
// FROM Endereco e JOIN Pedido p ON e.cod_endereco = p.cod_endereco
// GROUP BY e.bairro ORDER BY total_entregas DESC LIMIT 2;

print(
    db.pedidos.aggregate([
        // Etapa 1: Agrupar pelo bairro do endereço de entrega e contar as ocorrências.
        {
            $group: {
                _id: "$endereco_entrega.bairro",
                total_entregas: { $sum: 1 }
            }
        },
        // Etapa 2: Ordenar em ordem decrescente pela contagem.
        {
            $sort: {
                total_entregas: -1
            }
        },
        // Etapa 3: Limitar aos 2 primeiros resultados.
        {
            $limit: 2
        },
        // Etapa 4: Formatar a saída.
        {
            $project: {
                _id: 0,
                bairro: "$_id",
                total_entregas: 1
            }
        }
    ])
)


// --------------------------------------------------------
print("\n--- Consulta 3: Quantos clientes compraram em determinado intervalo de tempo? ---");
// SQL Equivalente:
// SELECT COUNT(DISTINCT CPF_cliente) AS total_clientes
// FROM Pedido WHERE data_prev_entrega BETWEEN '2024-01-01' AND '2024-12-31';

print(
    db.pedidos.aggregate([
        // Etapa 1: Filtrar os pedidos dentro do intervalo de datas desejado.
        {
            $match: {
            data_prev_entrega: {
                $gte: new Date("2024-01-01"),
                $lte: new Date("2024-12-31")
            }
            }
        },
        // Etapa 2: Agrupar por cliente para obter uma lista de clientes distintos.
        {
            $group: {
            _id: "$cliente_id"
            }
        },
        // Etapa 3: Contar o número de clientes distintos.
        {
            $count: "total_clientes"
        }
    ])
)


// --------------------------------------------------------
print("\n--- Consulta 4: Existe cliente com reincidência de parcelas em atraso? ---");
// SQL Equivalente:
// SELECT p.CPF_cliente, c.nome, COUNT(par.cod_pagamento) AS parcelas_atrasadas FROM Cliente c
// JOIN Pedido p ON c.CPF_cliente = p.CPF_cliente JOIN Parcela par ON p.cod_pedido = par.cod_pedido
// WHERE (par.data_pagamento IS NULL AND par.data_vencimento < CURDATE()) OR (par.data_pagamento > par.data_vencimento)
// GROUP BY p.CPF_cliente, c.nome HAVING COUNT(par.cod_pagamento) > 1;

print(
    db.pedidos.aggregate([
        // Etapa 1: Desmembrar o array de parcelas para processar cada uma individualmente.
        {
            $unwind: "$parcelas"
        },
        // Etapa 2: Filtrar apenas as parcelas em atraso.
        {
            $match: { // no sql seria WHERE
            $or: [
                { "parcelas.data_pagamento": null, "parcelas.data_vencimento": { $lt: hoje } },
                { $expr: { $gt: ["$parcelas.data_pagamento", "$parcelas.data_vencimento"] } }
            ]
            }
        },
        // Etapa 3: Agrupar por cliente e contar o número de parcelas atrasadas.
        {
            $group: { // no sql seria GROUP BY
            _id: "$cliente_id",
            parcelas_atrasadas: { $sum: 1 }
            }
        },
        // Etapa 4: Filtrar apenas os clientes com mais de 1 parcela em atraso.
        {
            $match: {
            parcelas_atrasadas: { $gt: 1 }
            }
        },
        // Etapa 5: Juntar com a coleção 'clientes' para obter o nome.
        {
            $lookup: {
            from: "clientes",
            localField: "_id",
            foreignField: "_id",
            as: "info_cliente"
            }
        },
        // Etapa 6: Formatar a saída.
        {
            $project: {
                _id: 0,
                CPF_cliente: "$_id",
                nome: { $arrayElemAt: ["$info_cliente.nome", 0] },
                parcelas_atrasadas: 1
            }
        }
    ])       
)


// --------------------------------------------------------
print("\n--- Consulta 5: Existe algum pedido em atraso? Se sim, qual(is)? ---");
// SQL Equivalente:
// SELECT cod_pedido, descricao, data_prev_entrega, data_entrega, status
// FROM Pedido WHERE data_entrega IS NULL AND data_prev_entrega < CURDATE();

print(
    db.pedidos.find(
        {
            // Condição 1: A data de entrega ainda não foi preenchida.
            data_entrega: null,
            // Condição 2: A data prevista de entrega já passou.
            data_prev_entrega: { $lt: hoje }
        },
        // Projeção: quais campos mostrar.
        {
            _id: 1,
            descricao: 1,
            data_prev_entrega: 1,
            data_entrega: 1,
            status: 1
        }
    )
)

// --------------------------------------------------------
use("casa_prado")
db.pedidos.getIndexes()

print("\n--- Schemas e Registros de Exemplo das Coleções ---");

// Schema da coleção 'clientes'
print("\n--- Schema da coleção 'clientes' (exemplo de registro) ---");
print(db.clientes.findOne());

// Schema da coleção 'pedidos'
print("\n--- Schema da coleção 'pedidos' (exemplo de registro) ---");
print(db.pedidos.findOne());

// Verificar outras coleções existentes no banco
print("\n--- Todas as coleções no banco 'casa_prado' ---");
print(db.getCollectionNames());

// Buscar um registro de cada coleção existente
const colecoes = db.getCollectionNames();
colecoes.forEach(function(nomeColecao) {
    print(`\n--- Exemplo de documento da coleção '${nomeColecao}' ---`);
    print(db.getCollection(nomeColecao).findOne());
});

// Contar documentos em cada coleção
print("\n--- Contagem de documentos por coleção ---");
colecoes.forEach(function(nomeColecao) {
    const count = db.getCollection(nomeColecao).countDocuments();
    print(`${nomeColecao}: ${count} documentos`);
});


// para a parte das consultas deveremos usar  o lookup

// Na parte que diz respeito ao modelo conceittual e lógico,
// falar do essencial do projeto: Abordar brevemente os fluxos príncipais do sistema
// e como as coleções se relacionam entre si.

// COrrigir modelo lógico e conceitual (Verificar campos qu estão diferentes)

// ligações entre as coleções no mesmo slide - identificar visualmente as ligações entre as coleções
// Colapsar campos de lista e aumentar o tamanho da fonte para melhorar a visualização das coleções
