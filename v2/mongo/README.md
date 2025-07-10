# Projeto de Banco de Dados Não-Relacional - Casa Prado

Este projeto demonstra a modelagem e implementação de um banco de dados não-relacional (MongoDB) para o sistema "Casa Prado", migrado de um modelo relacional. O objetivo é utilizar uma estrutura de documentos aninhados e referências para otimizar as consultas e representar as relações de forma eficiente.

## Modelo de Dados

Abaixo estão os diagramas que representam a estrutura das coleções no MongoDB.

### Modelo de Entidade e Relacionamento (Visão Geral)

Este diagrama mostra as principais coleções e como elas se relacionam entre si.

```mermaid
erDiagram
    clientes {
        string _id PK "CPF do cliente"
        string nome
        date data_nascimento
        string estado_civil
        string e_mail
        object telefones "Array de objetos"
        object enderecos "Array de objetos"
    }

    projetistas {
        string _id PK "CPF do projetista"
        string nome
        date data_admissao
        string telefone
    }

    pedidos {
        int _id PK "Código do pedido"
        string descricao
        date data_prev_entrega
        date data_entrega
        string status
        double valor_total
        string forma_pagamento
        string tipo_imovel
        string cliente_id FK "Ref. ao cliente"
        object endereco_entrega "Cópia desnormalizada"
        object parcelas "Array de objetos aninhados"
        object ambientes "Array de objetos aninhados"
    }

    pedidos ||--o{ clientes : "realiza"
    pedidos }o--o| projetistas : "é_responsável_por"
```

### Modelo de Classes (Visão Expandida)

Este diagrama detalha a estrutura interna dos documentos, incluindo os objetos e arrays aninhados.

```mermaid
classDiagram
    direction LR

    class clientes {
        <<Collection>>
        +string _id (PK)
        +string nome
        +date data_nascimento
        +string estado_civil
        +string e_mail
    }

    class telefone_obj {
        <<Embedded Object>>
        +string numero
    }

    class endereco_obj {
        <<Embedded Object>>
        +string tipo
        +string logradouro
        +string numero
        +string complemento
        +string bairro
        +string cidade
        +string cep
    }

    class projetistas {
        <<Collection>>
        +string _id (PK)
        +string nome
        +date data_admissao
        +string telefone
    }

    class pedidos {
        <<Collection>>
        +int _id (PK)
        +string descricao
        +date data_prev_entrega
        +date data_entrega
        +string status
        +double valor_total
        +string forma_pagamento
        +string tipo_imovel
        +string cliente_id (FK)
        +object endereco_entrega
    }

    class parcela_obj {
        <<Embedded Object>>
        +int cod_pagamento
        +date data_vencimento
        +date data_pagamento
        +double valor_pago
    }

    class ambiente_obj {
        <<Embedded Object>>
        +int cod_ambiente
        +string nome_ambiente
        +double area
        +string projetista_id (FK)
    }

    class versao_obj {
        <<Embedded Object>>
        +int cod_versao
        +string arquivo_planta
    }

    clientes "1" *-- "0..n" telefone_obj : telefones [array]
    clientes "1" *-- "0..n" endereco_obj : enderecos [array]

    pedidos "1" *-- "0..n" parcela_obj : parcelas [array]
    pedidos "1" *-- "0..n" ambiente_obj : ambientes [array]
    pedidos ..> clientes : "refere-se a"

    ambiente_obj "1" *-- "0..n" versao_obj : versoes [array]
    ambiente_obj ..> projetistas : "refere-se a"
```

## Como Executar o Projeto

### Pré-requisitos
1.  **Docker**: Para executar uma instância do MongoDB.
2.  **Visual Studio Code**: Editor de código.
3.  **Extensão MongoDB for VS Code**: Para interagir com o banco de dados e executar os scripts do Playground.
    *   [Link para a extensão no Marketplace](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)

### Passos para Execução

1.  **Iniciar o Contêiner do MongoDB**
    Abra um terminal e execute o seguinte comando para iniciar um contêiner Docker com o MongoDB, configurando o usuário e a senha como `root`:
    ```bash
    docker run --name meu-mongo -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root mongo:latest
    ```

2.  **Conectar ao Banco de Dados no VS Code**
    *   Abra o VS Code e vá para a aba da extensão MongoDB.
    *   Clique em "Add Connection" e cole a seguinte string de conexão:
        ```
        mongodb://root:root@localhost:27017/
        ```
    *   Conecte-se à instância. Você deverá vê-la na lista de conexões.

3.  **Executar os Scripts no Playground**
    Os scripts devem ser executados na ordem correta. Para executar um script, abra o arquivo `.mongodb.js` e clique no ícone de "Play" no canto superior direito do editor.

    *   **1º - `casa-prado-create.mongodb.js`**: Este script cria o banco de dados `casa_prado` e as coleções com suas respectivas validações de schema.
    *   **2º - `casa-prado-inserts.mongodb.js`**: Este script popula as coleções com os dados de exemplo.
    *   **3º - `casa-prado-consultas.mongodb.js`**: Este script executa as consultas de exemplo sobre os dados inseridos. Os resultados serão exibidos no painel "MongoDB Playground Results".
```// filepath: c:\Users\thall\OneDrive\Documentos\ifba\bdii\nao-relacional\trabalho\v2\mongo\README.md
# Projeto de Banco de Dados Não-Relacional - Casa Prado

Este projeto demonstra a modelagem e implementação de um banco de dados não-relacional (MongoDB) para o sistema "Casa Prado", migrado de um modelo relacional. O objetivo é utilizar uma estrutura de documentos aninhados e referências para otimizar as consultas e representar as relações de forma eficiente.

## Modelo de Dados

Abaixo estão os diagramas que representam a estrutura das coleções no MongoDB.

### Modelo de Entidade e Relacionamento (Visão Geral)

Este diagrama mostra as principais coleções e como elas se relacionam entre si.

```mermaid
erDiagram
    clientes {
        string _id PK "CPF do cliente"
        string nome
        date data_nascimento
        string estado_civil
        string e_mail
        object telefones "Array de objetos"
        object enderecos "Array de objetos"
    }

    projetistas {
        string _id PK "CPF do projetista"
        string nome
        date data_admissao
        string telefone
    }

    pedidos {
        int _id PK "Código do pedido"
        string descricao
        date data_prev_entrega
        date data_entrega
        string status
        double valor_total
        string forma_pagamento
        string tipo_imovel
        string cliente_id FK "Ref. ao cliente"
        object endereco_entrega "Cópia desnormalizada"
        object parcelas "Array de objetos aninhados"
        object ambientes "Array de objetos aninhados"
    }

    pedidos ||--o{ clientes : "realiza"
    pedidos }o--o| projetistas : "é_responsável_por"
```

### Modelo de Classes (Visão Expandida)

Este diagrama detalha a estrutura interna dos documentos, incluindo os objetos e arrays aninhados.

```mermaid
classDiagram
    direction LR

    class clientes {
        <<Collection>>
        +string _id (PK)
        +string nome
        +date data_nascimento
        +string estado_civil
        +string e_mail
    }

    class telefone_obj {
        <<Embedded Object>>
        +string numero
    }

    class endereco_obj {
        <<Embedded Object>>
        +string tipo
        +string logradouro
        +string numero
        +string complemento
        +string bairro
        +string cidade
        +string cep
    }

    class projetistas {
        <<Collection>>
        +string _id (PK)
        +string nome
        +date data_admissao
        +string telefone
    }

    class pedidos {
        <<Collection>>
        +int _id (PK)
        +string descricao
        +date data_prev_entrega
        +date data_entrega
        +string status
        +double valor_total
        +string forma_pagamento
        +string tipo_imovel
        +string cliente_id (FK)
        +object endereco_entrega
    }

    class parcela_obj {
        <<Embedded Object>>
        +int cod_pagamento
        +date data_vencimento
        +date data_pagamento
        +double valor_pago
    }

    class ambiente_obj {
        <<Embedded Object>>
        +int cod_ambiente
        +string nome_ambiente
        +double area
        +string projetista_id (FK)
    }

    class versao_obj {
        <<Embedded Object>>
        +int cod_versao
        +string arquivo_planta
    }

    clientes "1" *-- "0..n" telefone_obj : telefones [array]
    clientes "1" *-- "0..n" endereco_obj : enderecos [array]

    pedidos "1" *-- "0..n" parcela_obj : parcelas [array]
    pedidos "1" *-- "0..n" ambiente_obj : ambientes [array]
    pedidos ..> clientes : "refere-se a"

    ambiente_obj "1" *-- "0..n" versao_obj : versoes [array]
    ambiente_obj ..> projetistas : "refere-se a"
```

## Como Executar o Projeto

### Pré-requisitos
1.  **Docker**: Para executar uma instância do MongoDB.
2.  **Visual Studio Code**: Editor de código.
3.  **Extensão MongoDB for VS Code**: Para interagir com o banco de dados e executar os scripts do Playground.
    *   [Link para a extensão no Marketplace](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)

### Passos para Execução

1.  **Iniciar o Contêiner do MongoDB**
    Abra um terminal e execute o seguinte comando para iniciar um contêiner Docker com o MongoDB, configurando o usuário e a senha como `root`:
    ```bash
    docker run --name meu-mongo -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root mongo:latest
    ```