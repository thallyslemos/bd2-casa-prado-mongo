// Conexão com o banco de dados "casa_prado"
use("casa_prado");

// =================================================================================
// CONSULTAS ANÁLOGAS COM LÓGICA DE SUBCONSULTA E COMENTÁRIOS DETALHADOS
// =================================================================================

// --- 1. Clientes que se cadastraram mas nunca realizaram um pedido ---
print("\n--- Consulta 1: Clientes sem pedidos ---");
var clientes_sem_pedidos = db.clientes.aggregate([
  // O pipeline de agregação ($aggregate) processa os dados em etapas (stages).

  // Etapa 1: $lookup
  // Funciona de forma similar a um LEFT JOIN do SQL.
  // Ele "busca" na coleção 'pedidos' os documentos que correspondem à condição.
  {
    $lookup: {
      from: "pedidos",           // Coleção estrangeira para buscar dados.
      localField: "_id",         // Campo da coleção local ('clientes').
      foreignField: "cliente_id",// Campo da coleção estrangeira ('pedidos').
      as: "pedidos_do_cliente" // Nome do novo array que será adicionado aos documentos da coleção 'clientes'.
    }
  },

  // Etapa 2: $match
  // Filtra os documentos, similar ao WHERE do SQL.
  // Aqui, estamos mantendo apenas os documentos onde o array 'pedidos_do_cliente' tem tamanho 0.
  {
    $match: {
      pedidos_do_cliente: { $size: 0 } // $size é o operador que retorna o número de elementos em um array.
    }
  },

  // Etapa 3: $project
  // Remodela os documentos de saída. Similar a selecionar colunas específicas no SQL (SELECT).
  // 1 significa que o campo deve ser incluído, 0 significa que deve ser excluído.
  {
    $project: {
      _id: 1, // Inclui o campo _id (CPF do cliente).
      nome: 1,  // Inclui o campo nome.
      e_mail: 1 // Inclui o campo e_mail.
    }
  }
]);
print(clientes_sem_pedidos);


// --- 2. Pedidos com valor total acima da média de todos os pedidos ---
print("\n--- Consulta 2: Pedidos com valor acima da média ---");
var pedidos_acima_media = db.pedidos.aggregate([
  // Esta consulta demonstra uma "subconsulta" mais complexa.

  // Etapa 1: $group
  // Agrupa documentos. Usado para calcular valores agregados como soma, média, etc.
  // Aqui, agrupamos TODOS os documentos da coleção 'pedidos' em um único grupo (_id: null)
  // para calcular a média de 'valor_total' de toda a coleção.
  {
    $group: {
      _id: null, // Agrupa todos os documentos em um só.
      media_valor_total: { $avg: "$valor_total" } // Calcula a média ($avg) do campo 'valor_total'.
    }
  },

  // Etapa 2: $lookup com Pipeline
  // Um $lookup avançado que permite executar um pipeline de agregação na coleção estrangeira.
  {
    $lookup: {
      from: "pedidos",
      let: { media: "$media_valor_total" }, // 'let' define uma variável 'media' com o valor da média que calculamos na etapa anterior.
      pipeline: [ // O pipeline que será executado na coleção 'pedidos'.
        {
          $match: {
            // $expr permite usar expressões de agregação dentro do $match.
            // Aqui, comparamos se o 'valor_total' de cada pedido é maior ($gt) que a variável 'media' que definimos.
            // A variável é acessada com '$$'.
            $expr: { $gt: ["$valor_total", "$$media"] }
          }
        },
        {
           $project: { _id: 1, descricao: 1, valor_total: 1, cliente_id: 1 } // Seleciona os campos dos pedidos que atendem à condição.
        }
      ],
      as: "pedidos_acima_media" // O resultado do pipeline será armazenado neste array.
    }
  },

  // Etapa 3: $unwind
  // Desconstrói um campo de array de um documento de entrada para emitir um documento para cada elemento.
  // Se 'pedidos_acima_media' tem 2 documentos, a saída desta etapa terá 2 documentos principais.
  {
    $unwind: "$pedidos_acima_media"
  },

  // Etapa 4: $replaceRoot
  // Promove um documento aninhado para o nível superior.
  // Estamos substituindo o documento inteiro pelo conteúdo de 'pedidos_acima_media' para limpar a saída.
  {
    $replaceRoot: { newRoot: "$pedidos_acima_media" }
  }
]);
print(pedidos_acima_media);


// --- 3. Projetistas que trabalharam em mais de 2 projetos distintos ---
print("\n--- Consulta 3: Projetistas com mais de 2 projetos ---");
var projetistas_com_mais_de_2_projetos = db.pedidos.aggregate([
  // Etapa 1: $unwind
  // Desconstrói o array 'ambientes' para que possamos acessar o 'projetista_id' de cada ambiente individualmente.
  { $unwind: "$ambientes" },

  // Etapa 2: $group
  // Agrupa os documentos pelo 'projetista_id'.
  {
    $group: {
      _id: "$ambientes.projetista_id", // O campo que define o grupo.
      // $addToSet adiciona um valor a um array apenas se ele ainda não estiver lá, garantindo valores únicos.
      // Estamos criando um array de códigos de pedido únicos para cada projetista.
      pedidos_distintos: { $addToSet: "$_id" }
    }
  },

  // Etapa 3: $project
  // Cria um novo campo 'total_projetos' que é o tamanho ($size) do array 'pedidos_distintos'.
  {
    $project: {
        _id: 1, // Mantém o CPF do projetista.
        total_projetos: { $size: "$pedidos_distintos" }
    }
  },

  // Etapa 4: $match
  // Filtra para manter apenas os projetistas cujo 'total_projetos' é maior que ($gt) 2.
  {
      $match: {
          total_projetos: { $gt: 2 }
      }
  },

  // Etapa 5: $lookup
  // Busca o nome do projetista na coleção 'projetistas' usando o _id (CPF).
  {
    $lookup: {
        from: "projetistas",
        localField: "_id",
        foreignField: "_id",
        as: "info_projetista"
    }
  },

  // Etapa 6: $project
  // Formata a saída final.
  {
      $project: {
          _id: 0, // Exclui o campo _id.
          CPF_projetista: "$_id", // Renomeia _id para CPF_projetista.
          // $arrayElemAt pega um elemento de um array pelo seu índice. Usado para extrair o nome do projetista do array 'info_projetista'.
          nome_projetista: { $arrayElemAt: ["$info_projetista.nome", 0] },
          total_projetos: 1
      }
  }
]);
print(projetistas_com_mais_de_2_projetos);


// --- 4. Clientes com pedidos projetados por mais de um projetista ---
print("\n--- Consulta 4: Clientes com múltiplos projetistas em seus pedidos ---");
var clientes_com_multipros = db.pedidos.aggregate([
  // Etapa 1: $unwind
  // Desconstrói o array 'ambientes'.
  { $unwind: "$ambientes" },

  // Etapa 2: $group
  // Agrupa os documentos pelo 'cliente_id'.
  {
    $group: {
      _id: "$cliente_id",
      // Para cada cliente, cria um array de projetistas únicos ($addToSet).
      projetistas_distintos: { $addToSet: "$ambientes.projetista_id" }
    }
  },

  // Etapa 3: $match
  // Filtra para manter apenas os clientes cujo array 'projetistas_distintos' tem mais de um elemento.
  // A verificação `{"projetistas_distintos.1": { $exists: true }}` é uma forma eficiente de checar se o array tem um segundo elemento (índice 1).
  {
    $match: {
      "projetistas_distintos.1": { $exists: true }
    }
  },

  // Etapa 4: $lookup
  // Busca o nome do cliente na coleção 'clientes'.
  {
    $lookup: {
        from: "clientes",
        localField: "_id",
        foreignField: "_id",
        as: "info_cliente"
    }
  },

  // Etapa 5: $project
  // Formata a saída final.
  {
      $project: {
          _id: 0,
          CPF_cliente: "$_id",
          nome_cliente: { $arrayElemAt: ["$info_cliente.nome", 0] },
          projetistas: "$projetistas_distintos" // remover para manter retorno igual ao do relacional?
      }
  }
]);
print(clientes_com_multipros);


// --- 5. Pedidos que estão sendo gerenciados pelo projetista mais antigo ---
print("\n--- Consulta 5: Pedidos do projetista mais antigo ---");
var projetista_antigo = db.projetistas.aggregate([
  // Esta consulta começa na coleção 'projetistas' para encontrar o mais antigo primeiro.

  // Etapa 1: $sort
  // Ordena os documentos. 1 para ordem ascendente, -1 para descendente.
  { $sort: { data_admissao: 1 } }, // Ordena pela data de admissão da mais antiga para a mais nova.

  // Etapa 2: $limit
  // Restringe o número de documentos passados para a próxima etapa.
  { $limit: 1 }, // Pega apenas o primeiro documento após a ordenação (o mais antigo).

  // Etapa 3: $lookup com Pipeline
  // Usa o _id do projetista encontrado para buscar seus pedidos.
  {
    $lookup: {
      from: "pedidos",
      let: { projetista_id: "$_id" }, // Define a variável 'projetista_id'.
      pipeline: [
        {
          $match: {
            $expr: {
              // $in verifica se um valor existe dentro de um array.
              // Aqui, checamos se o '$$projetista_id' está no array 'ambientes.projetista_id' de cada pedido.
              $in: ["$$projetista_id", "$ambientes.projetista_id"]
            }
          }
        },
        {
          $project: { _id: 1, descricao: 1, valor_total: 1, cliente_id: 1 }
        }
      ],
      as: "pedidos_do_projetista"
    }
  },

  // Etapa 4: $unwind
  // Desconstrói o array de pedidos para criar um documento para cada pedido encontrado.
  { $unwind: "$pedidos_do_projetista"},

  // Etapa 5: $replaceRoot
  // Promove o documento do pedido para o nível raiz, limpando a saída.
  { $replaceRoot: { newRoot: "$pedidos_do_projetista" }}
]);
print(projetista_antigo);


/* --- resultado:


--- Consulta 1: Clientes sem pedidos ---
{
  cursorHasMore: false,
  documents: [
    {
      _id: '99988877766',
      nome: 'Brendon Lima',
      e_mail: 'brendon.lima@email.com'
    }
  ]
}

--- Consulta 2: Pedidos com valor acima da média ---
{
  cursorHasMore: false,
  documents: [
    {
      _id: 6,
      descricao: 'Recepção de clínica',
      valor_total: 25000,
      cliente_id: '55566677788'
    },
    {
      _id: 7,
      descricao: 'Consultório médico',
      valor_total: 28000,
      cliente_id: '55566677788'
    }
  ]
}

--- Consulta 3: Projetistas com mais de 2 projetos ---
{
  cursorHasMore: false,
  documents: [
    {
      total_projetos: 3,
      CPF_projetista: '66677788899',
      nome_projetista: 'Ana Oliveira'
    }
  ]
}

--- Consulta 4: Clientes com múltiplos projetistas em seus pedidos ---
{
  cursorHasMore: false,
  documents: [
    {
      CPF_cliente: '11122233344',
      nome_cliente: 'Gabriel Viana',
      projetistas: [Array]
    },
    {
      CPF_cliente: '55566677788',
      nome_cliente: 'Herbert Duarte',
      projetistas: [Array]
    }
  ]
}

--- Consulta 5: Pedidos do projetista mais antigo ---
{
  cursorHasMore: false,
  documents: [
    {
      _id: 1,
      descricao: 'Projeto cozinha planejada',
      valor_total: 8500,
      cliente_id: '12345678901'
    },
    {
      _id: 4,
      descricao: 'Home theater para sala',
      valor_total: 7500,
      cliente_id: '11122233344'
    }
  ]
}

*/