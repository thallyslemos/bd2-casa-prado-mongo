use("casa_prado")
// --------------------------------------------------------
// 1. Consultas na coleção "clientes"
// print("\n--- Consulta 1: Listar 1 cliente ---");

// print(db.clientes.findOne())

// print("\n--- Consulta 2: Listar 1 ---");
// print(db.pedidos.findOne())
// print("\n--- Consulta 3: Listar 1 ---");
// print(db.projetistas.findOne())
// db.pedidos.findOne()

// // Q 1 --------------------------
// db.pedidos.aggregate([
//   // Etapa 1: Agrupar os pedidos pelo ID do cliente e somar o valor total de cada um.
//   {
//     $group: {
//       _id: "$cliente_id",
//       total_gasto: { $sum: "$valor_total" }
//     }
//   },
//   // Etapa 2: Ordenar o resultado em ordem decrescente pelo total gasto.
//   {
//     $sort: {
//       total_gasto: -1
//     }
//   },
//   // Etapa 3: Limitar o resultado ao primeiro documento (o maior gastador).
//   {
//     $limit: 1
//   },
//   // Etapa 4 (Opcional, mas recomendado): Juntar com a coleção 'clientes' para obter o nome.
//   {
//     $lookup: {
//       from: "clientes",
//       localField: "_id",
//       foreignField: "_id",
//       as: "info_cliente"
//     }
//   },
//   // Etapa 5: Formatar a saída para mostrar os dados de forma mais limpa.
//   {
//     $project: {
//       _id: 0,
//       CPF_cliente: "$_id",
//       nome_cliente: { $arrayElemAt: ["$info_cliente.nome", 0] },
//       total_gasto: "$total_gasto"
//     }
//   }
// ])

// Q2 -----------------------------------------------------
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

// // Q 3 ----------------------------------------------------
// db.pedidos.aggregate([
//     // Etapa 1: Filtrar os pedidos dentro do intervalo de datas desejado.
//     {
//         $match: {
//         data_prev_entrega: {
//             $gte: new Date("2024-01-01"),
//             $lte: new Date("2024-12-31")
//         }
//         }
//     },
//     // Etapa 2: Agrupar por cliente para obter uma lista de clientes distintos.
//     {
//         $group: {
//         _id: "$cliente_id"
//         }
//     },
//     // Etapa 3: Contar o número de clientes distintos.
//     {
//         $count: "total_clientes"
//     }
// ])

// // Q 4 ----------------------------------------------------
// db.pedidos.aggregate([
//     // Etapa 1: Desmembrar o array de parcelas para processar cada uma individualmente.
//     {
//         $unwind: "$parcelas"
//     },
//     // Etapa 2: Filtrar apenas as parcelas em atraso.
//     {
//         $match: { // no sql seria WHERE
//         $or: [
//             { "parcelas.data_pagamento": null, "parcelas.data_vencimento": { $lt: hoje } },
//             { $expr: { $gt: ["$parcelas.data_pagamento", "$parcelas.data_vencimento"] } }
//         ]
//         }
//     },
//     // Etapa 3: Agrupar por cliente e contar o número de parcelas atrasadas.
//     {
//         $group: { // no sql seria GROUP BY
//         _id: "$cliente_id",
//         parcelas_atrasadas: { $sum: 1 }
//         }
//     },
//     // Etapa 4: Filtrar apenas os clientes com mais de 1 parcela em atraso.
//     {
//         $match: {
//         parcelas_atrasadas: { $gt: 1 }
//         }
//     },
//     // Etapa 5: Juntar com a coleção 'clientes' para obter o nome.
//     {
//         $lookup: {
//         from: "clientes",
//         localField: "_id",
//         foreignField: "_id",
//         as: "info_cliente"
//         }
//     },
//     // Etapa 6: Formatar a saída.
//     {
//         $project: {
//             _id: 0,
//             CPF_cliente: "$_id",
//             nome: { $arrayElemAt: ["$info_cliente.nome", 0] },
//             parcelas_atrasadas: 1
//         }
//     }
// ])     

// // Q 5 ------------------------------------
// db.pedidos.find(
//     {
//         // Condição 1: A data de entrega ainda não foi preenchida.
//         data_entrega: null,
//         // Condição 2: A data prevista de entrega já passou.
//         data_prev_entrega: { $lt: hoje }
//     },
//     // Projeção: quais campos mostrar.
//     {
//         _id: 1,
//         descricao: 1,
//         data_prev_entrega: 1,
//         data_entrega: 1,
//         status: 1
//     }
// )