// Conexão com o banco de dados "casa_prado"
use("casa_prado");

// Definição da data atual para as consultas que precisam dela.
const hoje = new Date();

// =================================================================================
// 5 NOVAS CONSULTAS GERENCIAIS PARA MONGODB
// =================================================================================

// --- 1. Projetista com o Maior Ticket Médio por Projeto (sem usar LIMIT) ---
print("\n--- Consulta 1: Projetista com Maior Ticket Médio ---");
db.pedidos.aggregate([
  { $unwind: "$ambientes" },
    {
    $group: {
      _id: "$ambientes.projetista_id",
      ticket_medio: 
      { $avg: "$valor_total" }
    }
  },
   {
    $facet: {
      "projetistasComTicket": [{ $match: {} }],
      "maxTicket": [
        { $group: { _id: null, max_valor: 
          { $max: "$ticket_medio" } } },
        { $unwind: "$max_valor" }
      ]
    }
  },
  
  // Etapa 4: Desagrupa os resultados para poder compará-los.
  { $unwind: "$projetistasComTicket" },
  { $unwind: "$maxTicket" },
  
  // Etapa 5: Usa $redact para manter apenas o documento cujo ticket médio é igual ao máximo encontrado.
  {
    $redact: {
      $cond: {
        if: { $eq: ["$projetistasComTicket.ticket_medio", "$maxTicket.max_valor"] },
        then: "$$KEEP", // Mantém o documento
        else: "$$PRUNE" // Descarta o documento
      }
    }
  },

  // Etapa 6: Faz o lookup para buscar o nome do projetista.
  {
    $lookup: {
      from: "projetistas",
      localField: "projetistasComTicket._id",
      foreignField: "_id",
      as: "info_projetista"
    }
  },

  // Etapa 7: Formata a saída final.
  {
    $project: {
      _id: 0,
      nome_projetista: { $arrayElemAt: ["$info_projetista.nome", 0] },
      ticket_medio: { $round: ["$projetistasComTicket.ticket_medio", 2] }
    }
  }
]);


// --- 2. Bairro com Maior Incidência de Atrasos na Entrega ---
print("\n--- Consulta 2: Bairros com Maior Incidência de Atrasos ---"); // Adicionar registros com data de entrega posterior à prevista
db.pedidos.aggregate([
  // Etapa 1: Filtra apenas os pedidos que foram entregues com atraso.
  {
    $match: {
      data_entrega: { $ne: null }, // Garante que o pedido foi entregue.
      $expr: { $gt: ["$data_entrega", "$data_prev_entrega"] } // Compara se a data de entrega é maior que a prevista.
    }
  },
  
  // Etapa 2: Agrupa pelo bairro do endereço de entrega e conta as ocorrências.
  {
    $group: {
      _id: "$endereco_entrega.bairro",
      total_de_atrasos: { $sum: 1 }
    }
  },
  
  // Etapa 3: Formata a saída.
  {
    $project: {
      _id: 0,
      bairro: "$_id",
      total_de_atrasos: 1
    }
  },
  
  // Etapa 4: Ordena para mostrar os bairros com mais atrasos primeiro.
  { $sort: { total_de_atrasos: -1 } }
]);
print(bairros_com_atraso);


// --- 3. Média de Versões de Projeto por Projetista ---
print("\n--- Consulta 3: Média de Versões por Projetista ---");
var media_versoes_projetista = db.pedidos.aggregate([
  // Etapa 1: Desagrupa os ambientes de cada pedido.
  { $unwind: "$ambientes" },
  
  // Etapa 2: Desagrupa as versões de cada ambiente.
  { $unwind: "$ambientes.versoes" },
  
  // Etapa 3: Agrupa pelo projetista para contar o total de versões e o número de projetos distintos.
  {
    $group: {
      _id: "$ambientes.projetista_id",
      total_versoes: { $sum: 1 },
      pedidos_distintos: { $addToSet: "$_id" } // addToSet garante que cada ID de pedido seja contado apenas uma vez.
    }
  },
  
  // Etapa 4: Busca o nome do projetista na coleção 'projetistas'.
  {
    $lookup: {
      from: "projetistas",
      localField: "_id",
      foreignField: "_id",
      as: "info_projetista"
    }
  },
  
  // Etapa 5: Formata a saída e calcula a média.
  {
    $project: {
      _id: 0,
      nome_projetista: { $arrayElemAt: ["$info_projetista.nome", 0] },
      media_versoes_por_projeto: {
        // Divide o total de versões pelo tamanho do array de pedidos distintos.
        $divide: ["$total_versoes", { $size: "$pedidos_distintos" }]
      }
    }
  },
  
  // Etapa 6: Ordena pela maior média de versões.
  { $sort: { media_versoes_por_projeto: -1 } }
]);


// --- 4. Clientes que Possuem Parcelas em Atraso ---
print("\n--- Consulta 4: Clientes com Parcelas em Atraso ---");
db.pedidos.aggregate([
  // Etapa 1: Desagrupa o array de parcelas.
  { $unwind: "$parcelas" },
  
  // Etapa 2: Filtra para encontrar apenas as parcelas vencidas e não pagas.
  {
    $match: {
      "parcelas.data_pagamento": null,
      "parcelas.data_vencimento": { $lt: hoje }
    }
  },
  
  // Etapa 3: Agrupa pelo ID do cliente para obter uma lista de clientes únicos.
  {
    $group: {
      _id: "$cliente_id"
    }
  },
  
  // Etapa 4: Busca os detalhes (nome, e-mail) dos clientes encontrados.
  {
    $lookup: {
      from: "clientes",
      localField: "_id",
      foreignField: "_id",
      as: "info_cliente"
    }
  },
  
  // Etapa 5: Formata a saída final.
  {
    $project: {
      _id: 0,
      CPF_cliente: { $arrayElemAt: ["$info_cliente._id", 0] },
      nome: { $arrayElemAt: ["$info_cliente.nome", 0] },
      e_mail: { $arrayElemAt: ["$info_cliente.e_mail", 0] }
    }
  }
]);


// --- 5. Quantidade de Pedidos por Estado Civil do Cliente ---
print("\n--- Consulta 5: Quantidade de Pedidos por Estado Civil ---");
db.pedidos.aggregate([
  // Etapa 1: Junta a coleção 'pedidos' com a 'clientes' para acessar o estado civil.
  {
    $lookup: {
      from: "clientes",
      localField: "cliente_id",
      foreignField: "_id",
      as: "info_cliente"
    }
  },
  
  // Etapa 2: Desagrupa o resultado do lookup, que é um array.
  { $unwind: "$info_cliente" },
  
  // Etapa 3: Agrupa pelo estado civil e conta o número de pedidos.
  {
    $group: {
      _id: "$info_cliente.estado_civil",
      quantidade_de_pedidos: { $sum: 1 }
    }
  },
  
  // Etapa 4: Formata a saída.
  {
    $project: {
      _id: 0,
      estado_civil: "$_id",
      quantidade_de_pedidos: 1
    }
  },
  
  // Etapa 5: Ordena pela maior quantidade de pedidos.
  { $sort: { quantidade_de_pedidos: -1 } }
]);

// =================================================================================
// --- Reultados:


// --- Consulta 1: Projetista com Maior Ticket Médio ---
// {
//   cursorHasMore: false,
//   documents: [ { nome_projetista: 'Ana Karolina', ticket_medio: 17400 } ]
// }

// --- Consulta 2: Bairros com Maior Incidência de Atrasos ---
// { cursorHasMore: false, documents: [] }

// --- Consulta 3: Média de Versões por Projetista ---
// {
//   cursorHasMore: false,
//   documents: [
//     { nome_projetista: 'João Mendes', media_versoes_por_projeto: 1 },
//     { nome_projetista: 'Ana Oliveira', media_versoes_por_projeto: 1 },
//     { nome_projetista: 'Ana Karolina', media_versoes_por_projeto: 1 }
//   ]
// }

// --- Consulta 4: Clientes com Parcelas em Atraso ---
// {
//   cursorHasMore: false,
//   documents: [
//     {
//       CPF_cliente: '98765432100',
//       nome: 'Maria Souza',
//       e_mail: 'maria@email.com'
//     },
//     {
//       CPF_cliente: '12345678901',
//       nome: 'Carlos Silva',
//       e_mail: 'carlos@email.com'
//     },
//     {
//       CPF_cliente: '55566677788',
//       nome: 'Herbert Duarte',
//       e_mail: 'herbert.duarte@email.com'
//     }
//   ]
// }

// --- Consulta 5: Quantidade de Pedidos por Estado Civil ---
// {
//   cursorHasMore: false,
//   documents: [
//     { quantidade_de_pedidos: 4, estado_civil: 'Solteiro' },
//     { quantidade_de_pedidos: 3, estado_civil: 'Casado' }
//   ]
// }