// Script para criação do banco de dados e população das coleções
// Feito e testado para MongoDB for VScode (extensão do VSCode)

// Conexão com o banco de dados "casa_prado"
use("casa_prado")

// --------------------------------------------------------
// 1. Apagando coleções existentes (para garantir um começo limpo)
print("Apagando coleções existentes...");
db.clientes.drop();
db.projetistas.drop();
db.pedidos.drop();
print("Coleções apagadas com sucesso!");

// --------------------------------------------------------
// 2. Populando a coleção "clientes"
// Os dados de telefone e endereço são aninhados diretamente no documento do cliente.
print("Populando a coleção 'clientes'...");
db.clientes.insertMany([
  {
    "_id": "12345678901",
    "nome": "Carlos Silva",
    "data_nascimento": new Date("1985-06-15"),
    "estado_civil": "Casado",
    "e_mail": "carlos@email.com",
    "telefones": [
      { "numero": "11987654321" }
    ],
    "enderecos": [
      {
        "tipo": "Residencial",
        "logradouro": "Rua Fictícia", 
        "numero": "100",
        "complemento": "Apto 101",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "cep": "01001000"
      }
    ]
  },
  {
    "_id": "98765432100",
    "nome": "Maria Souza",
    "data_nascimento": new Date("1992-03-22"),
    "estado_civil": "Solteiro",
    "e_mail": "maria@email.com",
    "telefones": [
      { "numero": "21987654321" }
    ],
    "enderecos": [
      {
        "tipo": "Comercial",
        "logradouro": "Avenida Brasil", 
        "numero": "200",
        "complemento": "Casa",
        "bairro": "Bela Vista",
        "cidade": "Rio de Janeiro",
        "cep": "20020020"
      }
    ]
  },
  {
    "_id": "00011122233",
    "nome": "João Duarte",
    "data_nascimento": new Date("1992-03-22"),
    "estado_civil": "Casado",
    "e_mail": "joao@email.com",
    "telefones": [],
    "enderecos": []
  }
]);
print("Coleção 'clientes' populada com sucesso!");

// --------------------------------------------------------
// 3. Populando a coleção "projetistas"
print("Populando a coleção 'projetistas'...");
db.projetistas.insertMany([
  {
    "_id": "55544433322",
    "nome": "João Mendes",
    "data_admissao": new Date("2020-02-10"),
    "telefone": "11987654333"
  },
  {
    "_id": "66677788899",
    "nome": "Ana Oliveira",
    "data_admissao": new Date("2021-05-05"),
    "telefone": "21987654444"
  }
]);
print("Coleção 'projetistas' populada com sucesso!");


// --------------------------------------------------------
// 4. Populando a coleção "pedidos"
// Dados aninhados: Parcelas, Ambientes e Versões.
// Dados referenciados: Cliente e Projetista.
// Endereço de entrega é copiado (desnormalizado) para manter o histórico.
print("Populando a coleção 'pedidos'...");
db.pedidos.insertMany([
  {
    "_id": 1,
    "descricao": "Projeto para reforma de apartamento",
    "data_prev_entrega": new Date("2024-07-20"),
    "data_entrega": null,
    "status": "Assistência técnica",
    "valor_total": 5000.00,
    "forma_pagamento": "Pix",
    "tipo_imovel": "Residencial",
    "cliente_id": "12345678901",
    "endereco_entrega": {
        "logradouro": "Rua Fictícia",
        "numero": "100",
        "complemento": "Apto 101",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "cep": "01001000"
    },
    "parcelas": [
      { "data_vencimento": new Date("2024-07-25"), "data_pagamento": new Date("2024-07-27"), "valor_pago": 2500.00 },
      { "data_vencimento": new Date("2024-08-25"), "data_pagamento": new Date("2024-08-27"), "valor_pago": 2500.00 },
      { "data_vencimento": new Date("2024-09-25"), "data_pagamento": null, "valor_pago": 2500.00 }
    ],
    "ambientes": [
      {
        "nome_ambiente": "Sala de estar",
        "area": 30.50,
        "projetista_id": "55544433322",
        "versoes": [
          {  "arquivo_planta": "planta_sala.pdf" }
        ]
      }
    ]
  },
  {
    "_id": 2,
    "descricao": "Projeto para reforma de apartamento 2",
    "data_prev_entrega": new Date("2024-07-20"),
    "data_entrega": new Date("2024-07-10"),
    "status": "Solicitado",
    "valor_total": 5000.00,
    "forma_pagamento": "Pix",
    "tipo_imovel": "Residencial",
    "cliente_id": "12345678901",
    "endereco_entrega": {
        "logradouro": "Rua Fictícia",
        "numero": "100",
        "complemento": "Apto 101",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "cep": "01001000"
    },
    "parcelas": [
        { "data_vencimento": new Date("2024-08-25"), "data_pagamento": null, "valor_pago": 6000.00 }
    ],
    "ambientes": [
       {
        "nome_ambiente": "Escritório Principal",
        "area": 50.00,
        "projetista_id": "66677788899",
        "versoes": [
          {  "arquivo_planta": "planta_escritorio.pdf" }
        ]
      }
    ]
  },
    {
    "_id": 5,
    "descricao": "Construção de escritório",
    "data_prev_entrega": new Date("2024-08-15"),
    "data_entrega": new Date("2024-08-15"),
    "status": "Em produção",
    "valor_total": 12000.00,
    "forma_pagamento": "Transferência bancária",
    "tipo_imovel": "Comercial",
    "cliente_id": "98765432100",
    "endereco_entrega": {
        "logradouro": "Avenida Brasil",
        "numero": "200",
        "complemento": "Casa",
        "bairro": "Bela Vista",
        "cidade": "Rio de Janeiro",
        "cep": "20020020"
    },
    "parcelas": [],
    "ambientes": []
  }
]);
print("Coleção 'pedidos' populada com sucesso!");

print("--------------------------------------------------------");
print("Criação e população do banco 'casa_prado' finalizadas.");