// =================================================================================
// SCRIPT COMPLETO DE CRIAÇÃO E INSERÇÃO PARA O BANCO 'casa_prado'
// =================================================================================

// Conexão com o banco de dados "casa_prado"
use("casa_prado");

// --------------------------------------------------------
// 1. Apagando coleções existentes para garantir um começo limpo
print("Apagando coleções existentes...");
db.clientes.drop();
db.projetistas.drop();
db.pedidos.drop();
print("Coleções apagadas com sucesso!");

// --------------------------------------------------------
// 2. Populando a coleção "clientes" com todos os registros
print("Populando a coleção 'clientes'...");
db.clientes.insertMany([
  // Clientes originais
  {
    "_id": "12345678901",
    "nome": "Carlos Silva",
    "data_nascimento": new Date("1985-06-15"),
    "estado_civil": "Casado",
    "e_mail": "carlos@email.com",
    "telefones": [{ "numero": "11987654321" }],
    "enderecos": [{ "tipo": "Residencial", "logradouro": "Rua Fictícia", "numero": "100", "complemento": "Apto 101", "bairro": "Candeias", "cidade": "Vitória da Conquista", "cep": "45028000" }]
  },
  {
    "_id": "98765432100",
    "nome": "Maria Souza",
    "data_nascimento": new Date("1992-03-22"),
    "estado_civil": "Solteiro",
    "e_mail": "maria@email.com",
    "telefones": [{ "numero": "21987654321" }],
    "enderecos": [{ "tipo": "Comercial", "logradouro": "Avenida Brasil", "numero": "200", "complemento": "Casa", "bairro": "Recreio", "cidade": "Vitória da Conquista", "cep": "45020505" }]
  },
  // Novos Clientes
  {
    "_id": "00011122233",
    "nome": "Thallys Viana",
    "data_nascimento": new Date("1995-08-20"),
    "estado_civil": "Solteiro",
    "e_mail": "thallys.viana@email.com",
    "telefones": [],
    "enderecos": [{ "tipo": "Residencial", "logradouro": "Av. Juracy Magalhães", "numero": "330", "complemento": "Apto 305", "bairro": "Centro", "cidade": "Vitória da Conquista", "cep": "45000190" }]
  },
  {
    "_id": "11122233344",
    "nome": "Gabriel Viana",
    "data_nascimento": new Date("1998-01-15"),
    "estado_civil": "Solteiro",
    "e_mail": "gabriel.viana@email.com",
    "telefones": [],
    "enderecos": [{ "tipo": "Residencial", "logradouro": "Av. Rosa Cruz", "numero": "110", "complemento": "Apto 101", "bairro": "Candeias", "cidade": "Vitória da Conquista", "cep": "45028000" }]
  },
  {
    "_id": "55566677788",
    "nome": "Herbert Duarte",
    "data_nascimento": new Date("1991-11-30"),
    "estado_civil": "Casado",
    "e_mail": "herbert.duarte@email.com",
    "telefones": [],
    "enderecos": [{ "tipo": "Comercial", "logradouro": "Av. Olívia Flores", "numero": "440", "complemento": "Sala 50", "bairro": "Bela Vista", "cidade": "Vitória da Conquista", "cep": "45027500" }]
  },
  {
    "_id": "99988877766",
    "nome": "Brendon Lima",
    "data_nascimento": new Date("2000-05-25"),
    "estado_civil": "Solteiro",
    "e_mail": "brendon.lima@email.com",
    "telefones": [],
    "enderecos": []
  }
]);
print("Coleção 'clientes' populada com sucesso!");

// --------------------------------------------------------
// 3. Populando a coleção "projetistas" com todos os registros
print("Populando a coleção 'projetistas'...");
db.projetistas.insertMany([
  {
    "_id": "55544433322",
    "nome": "João Mendes",
    "data_admissao": new Date("2019-02-10"), // O mais antigo
    "telefone": "77987654333"
  },
  {
    "_id": "66677788899",
    "nome": "Ana Oliveira",
    "data_admissao": new Date("2021-05-05"),
    "telefone": "77987654444"
  },
  {
    "_id": "33322211100",
    "nome": "Ana Karolina",
    "data_admissao": new Date("2022-08-01"),
    "telefone": "77912345678"
  }
]);
print("Coleção 'projetistas' populada com sucesso!");

// --------------------------------------------------------
// 4. Populando a coleção "pedidos" com todos os registros
print("Populando a coleção 'pedidos'...");
db.pedidos.insertMany([
  {
    "_id": 1,
    "descricao": "Projeto cozinha planejada",
    "data_prev_entrega": new Date("2024-07-20"),
    "data_entrega": null,
    "status": "Em produção",
    "valor_total": 8500.00,
    "forma_pagamento": "Pix",
    "tipo_imovel": "Residencial",
    "cliente_id": "12345678901",
    "endereco_entrega": { "logradouro": "Rua Fictícia", "numero": "100", "complemento": "Apto 101", "bairro": "Candeias", "cidade": "Vitória da Conquista", "cep": "45028000" },
    "parcelas": [{ "data_vencimento": new Date("2024-07-30"), "data_pagamento": null, "valor_pago": 4250.00 }, { "data_vencimento": new Date("2024-08-30"), "data_pagamento": null, "valor_pago": 4250.00 }],
    "ambientes": [{ "cod_ambiente": 1, "nome_ambiente": "Cozinha", "area": 25.50, "projetista_id": "55544433322", "versoes": [{ "arquivo_planta": "planta_cozinha_v1.pdf" }] }]
  },
  {
    "_id": 2,
    "descricao": "Móveis para escritório",
    "data_prev_entrega": new Date("2024-08-15"),
    "data_entrega": null,
    "status": "Solicitado",
    "valor_total": 12000.00,
    "forma_pagamento": "Boleto",
    "tipo_imovel": "Comercial",
    "cliente_id": "98765432100",
    "endereco_entrega": { "logradouro": "Avenida Brasil", "numero": "200", "complemento": "Casa", "bairro": "Recreio", "cidade": "Vitória da Conquista", "cep": "45020505" },
    "parcelas": [{ "data_vencimento": new Date("2024-08-20"), "data_pagamento": new Date("2024-08-20"), "valor_pago": 6000.00 }, { "data_vencimento": new Date("2024-09-20"), "data_pagamento": null, "valor_pago": 6000.00 }],
    "ambientes": [{ "cod_ambiente": 2, "nome_ambiente": "Escritório Central", "area": 40.00, "projetista_id": "66677788899", "versoes": [{ "arquivo_planta": "planta_escritorio_v2.pdf" }] }]
  },
  {
    "_id": 3,
    "descricao": "Quarto de casal completo",
    "data_prev_entrega": new Date("2024-09-10"),
    "data_entrega": new Date("2024-09-08"),
    "status": "Entregue",
    "valor_total": 9500.00,
    "forma_pagamento": "Cartão de crédito",
    "tipo_imovel": "Residencial",
    "cliente_id": "00011122233",
    "endereco_entrega": { "logradouro": "Av. Juracy Magalhães", "numero": "330", "complemento": "Apto 305", "bairro": "Centro", "cidade": "Vitória da Conquista", "cep": "45000190" },
    "parcelas": [{ "data_vencimento": new Date("2024-09-15"), "data_pagamento": new Date("2024-09-15"), "valor_pago": 9500.00 }],
    "ambientes": [{ "cod_ambiente": 3, "nome_ambiente": "Quarto Casal", "area": 20.00, "projetista_id": "66677788899", "versoes": [{ "arquivo_planta": "planta_quarto_final.pdf" }] }]
  },
  {
    "_id": 4,
    "descricao": "Home theater para sala",
    "data_prev_entrega": new Date("2024-09-25"),
    "data_entrega": null,
    "status": "Em produção",
    "valor_total": 7500.00,
    "forma_pagamento": "Pix",
    "tipo_imovel": "Residencial",
    "cliente_id": "11122233344",
    "endereco_entrega": { "logradouro": "Av. Rosa Cruz", "numero": "110", "complemento": "Apto 101", "bairro": "Candeias", "cidade": "Vitória da Conquista", "cep": "45028000" },
    "parcelas": [],
    "ambientes": [{ "cod_ambiente": 4, "nome_ambiente": "Sala de TV", "area": 22.00, "projetista_id": "55544433322", "versoes": [{ "arquivo_planta": "planta_hometheater_v1.pdf" }] }]
  },
  {
    "_id": 5,
    "descricao": "Varanda gourmet",
    "data_prev_entrega": new Date("2024-10-05"),
    "data_entrega": null,
    "status": "Em produção",
    "valor_total": 6800.00,
    "forma_pagamento": "Transferência bancária",
    "tipo_imovel": "Residencial",
    "cliente_id": "11122233344",
    "endereco_entrega": { "logradouro": "Av. Rosa Cruz", "numero": "110", "complemento": "Apto 101", "bairro": "Candeias", "cidade": "Vitória da Conquista", "cep": "45028000" },
    "parcelas": [],
    "ambientes": [{ "cod_ambiente": 5, "nome_ambiente": "Varanda", "area": 15.00, "projetista_id": "33322211100", "versoes": [{ "arquivo_planta": "planta_varanda_v3.pdf" }] }]
  },
  {
    "_id": 6,
    "descricao": "Recepção de clínica",
    "data_prev_entrega": new Date("2024-10-20"),
    "data_entrega": null,
    "status": "Solicitado",
    "valor_total": 25000.00,
    "forma_pagamento": "Boleto",
    "tipo_imovel": "Comercial",
    "cliente_id": "55566677788",
    "endereco_entrega": { "logradouro": "Av. Olívia Flores", "numero": "440", "complemento": "Sala 50", "bairro": "Bela Vista", "cidade": "Vitória da Conquista", "cep": "45027500" },
    "parcelas": [{ "data_vencimento": new Date("2024-10-30"), "data_pagamento": null, "valor_pago": 12500.00 }, { "data_vencimento": new Date("2024-11-30"), "data_pagamento": null, "valor_pago": 12500.00 }],
    "ambientes": [{ "cod_ambiente": 6, "nome_ambiente": "Recepção", "area": 35.00, "projetista_id": "66677788899", "versoes": [{ "arquivo_planta": "planta_recepcao_v1.pdf" }] }]
  },
  {
    "_id": 7,
    "descricao": "Consultório médico",
    "data_prev_entrega": new Date("2024-11-15"),
    "data_entrega": null,
    "status": "Solicitado",
    "valor_total": 28000.00,
    "forma_pagamento": "Boleto",
    "tipo_imovel": "Comercial",
    "cliente_id": "55566677788",
    "endereco_entrega": { "logradouro": "Av. Olívia Flores", "numero": "440", "complemento": "Sala 50", "bairro": "Bela Vista", "cidade": "Vitória da Conquista", "cep": "45027500" },
    "parcelas": [],
    "ambientes": [{ "cod_ambiente": 7, "nome_ambiente": "Consultório", "area": 30.00, "projetista_id": "33322211100", "versoes": [{ "arquivo_planta": "planta_consultorio_v1.pdf" }] }]
  }
]);
print("Coleção 'pedidos' populada com sucesso!");

print("--------------------------------------------------------");
print("Criação e população do banco 'casa_prado' finalizadas.");