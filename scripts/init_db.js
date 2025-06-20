const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

// Caminho para o banco de dados
const dbPath = path.join(__dirname, "../src/qualicraft.db");

// Abrir o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error("Erro ao abrir o banco de dados:", err.message);
  }
  console.log("Conectado ao banco de dados SQLite.");
});

// Criar tabelas e inserir dados
db.serialize(() => {
  // Tabela de usuários
  db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            isAdmin INTEGER DEFAULT 0
        )
    `);

  // Tabela de produtos
  db.run(`
        CREATE TABLE IF NOT EXISTS Products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            image TEXT
        )
    `);

  // Tabela de carrinho
  db.run(`
        CREATE TABLE IF NOT EXISTS Cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY(user_id) REFERENCES Users(id),
            FOREIGN KEY(product_id) REFERENCES Products(id)
        )
    `);

  // Tabela de pedidos
  db.run(`
        CREATE TABLE IF NOT EXISTS Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            first_name TEXT,
            last_name TEXT,
            address TEXT,
            number TEXT,
            cep TEXT,
            phone TEXT,
            email TEXT,
            payment_method TEXT,
            card_number TEXT,
            card_expiry TEXT,
            card_cvc TEXT,
            boleto_code TEXT,
            pix_key TEXT,
            total_price REAL,
            status TEXT,
            order_number TEXT,
            FOREIGN KEY(user_id) REFERENCES Users(id)
        )
    `);
  console.log("Tabelas criadas com sucesso.");

  // Inserir dados de exemplo para produtos
  const products = [
    {
      name: "Caçadores de Bugs",
      description:
        "<strong>Descrição:</strong> Um jogo de tiro ao alvo onde o jogador precisa clicar rapidamente nos bugs que aparecem aleatoriamente na tela antes que eles infectem o código. <br><strong>Missão:</strong> Detecção precoce de defeitos, importância de testes regressivos.",
      price: 199.00,
      image: "images/produtos/imagem1.png",
    },
    {
      name: "Jogo 2",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem2.png",
    },
    {
      name: "Jogo 3",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 660.0,
      image: "images/produtos/imagem3.png",
    },
    {
      name: "Jogo 4",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 217.0,
      image: "images/produtos/imagem4.png",
    },
    {
      name: "Jogo 5",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem5.png",
    },
    {
      name: "Jogo 6",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 830.0,
      image: "images/produtos/imagem6.png",
    },
    {
      name: "Jogo 7",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem7.png",
    },
    {
      name: "Jogo 8",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 490.0,
      image: "images/produtos/imagem8.png",
    },
    {
      name: "Jogo 9",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 490.0,
      image: "images/produtos/imagem9.png",
    },
    {
      name: "Jogo 10",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem10.png",
    },
    {
      name: "Jogo 11",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem11.png",
    },
    {
      name: "Jogo 12",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem12.png",
    },
    {
      name: "Jogo 13",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 310.0,
      image: "images/produtos/imagem13.png",
    },
    {
      name: "Jogo 14",
      description:
       "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 0.0,
      image: "images/produtos/imagem14.png",
    },
    {
      name: "Jogo 15",
      description:
        "<strong>Descrição:</strong> escrever a descrição aqui. <br><strong>Missão:</strong> escrever a missão aqui.",
      price: 310.0,
      image: "images/produtos/imagem15.png",
    },
  ];

  products.forEach((product) => {
    db.run(
      "INSERT INTO Products (name, description, price, image) VALUES (?, ?, ?, ?)",
      [product.name, product.description, product.price, product.image]
    );
  });

  console.log("Produtos de exemplo inseridos com sucesso.");

  // Inserir usuário administrador
  const adminEmail = "admin@admin.com";
  const adminPassword = "admin";
  const adminName = "Admin";
  const saltRounds = 10;

  bcrypt.hash(adminPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Erro ao hashear a senha:", err.message);
      db.close((closeErr) => {
        if (closeErr) {
          console.error("Erro ao fechar o banco de dados:", closeErr.message);
        }
      });
      return;
    }
    db.run(
      "INSERT INTO Users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)",
      [adminName, adminEmail, hashedPassword, 1], // 1 indica que é administrador
      (err) => {
        if (err) {
          console.error("Erro ao inserir usuário administrador:", err.message);
        } else {
          console.log("Usuário administrador inserido com sucesso.");
        }
        db.close((closeErr) => {
          if (closeErr) {
            console.error("Erro ao fechar o banco de dados:", closeErr.message);
          } else {
            console.log("Fechando a conexão com o banco de dados SQLite.");
          }
        });
      }
    );
  });
});
