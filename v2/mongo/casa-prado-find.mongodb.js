// Conexão com o banco de dados "casa_prado"
use("casa_prado");
//db.pedidos.findOne({ _id: 6 });
//db.clientes.findOne({ _id: "55566677788" });
db.projetistas.findOne({ _id: "66677788899" });
// =================================================================================
// EXEMPLOS DE CONSULTA SIMPLES POR COLEÇÃO (DADOS RELACIONADOS)
// =================================================================================

// --- 1. Exemplo de um documento da coleção 'pedidos' ---
print("\n--- Buscando o Pedido com _id: 6 ---");
var um_pedido = db.pedidos.findOne({ _id: 6 });
print(um_pedido);


// --- 2. Exemplo de um documento da coleção 'clientes' ---
print("\n--- Buscando o Cliente do Pedido 6 (CPF: 55566677788) ---");
// Usamos o 'cliente_id' do resultado anterior para buscar o cliente correspondente.
var um_cliente = db.clientes.findOne({ _id: "55566677788" });
print(um_cliente);


// --- 3. Exemplo de um documento da coleção 'projetistas' ---
print("\n--- Buscando o Projetista do Pedido 6 (CPF: 66677788899) ---");
// Usamos o 'projetista_id' que está dentro do array 'ambientes' do pedido para buscar o projetista.
var um_projetista = db.projetistas.findOne({ _id: "66677788899" });
print(um_projetista);