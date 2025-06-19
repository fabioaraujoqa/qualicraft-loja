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
      name: "Timeless Toys Skins",
      description:
        "Skin Pack clássico para quem quer diversão sem limites no mundo dos blocos.",
      price: 0.0,
      image: "images/produtos/imagem1.png",
    },
    {
      name: "adidas Adventurers Add-On",
      description:
        "Pacote oficial da Adidas com aventuras épicas e estilo inconfundível.",
      price: 0.0,
      image: "images/produtos/imagem2.png",
    },
    {
      name: "Realism Shades",
      description:
        "Transforme seu mundo com gráficos realistas e sombreados cinematográficos.",
      price: 660.0,
      image: "images/produtos/imagem3.png",
    },
    {
      name: "Senna World",
      description:
        "Reviva a emoção das pistas com Senna em uma experiência de corrida no Minecraft.",
      price: 217.0,
      image: "images/produtos/imagem4.png",
    },
    {
      name: "Artemis: Rocket Build",
      description:
        "Monte seu próprio foguete e explore o espaço como um verdadeiro engenheiro da NASA.",
      price: 0.0,
      image: "images/produtos/imagem5.png",
    },
    {
      name: "Immersive Horror Add-on",
      description:
        "Prepare-se para sustos reais com essa aventura sombria em blocos.",
      price: 830.0,
      image: "images/produtos/imagem6.png",
    },
    {
      name: "Hermitcraft Season 9 Map",
      description:
        "Explore o mapa lendário da nona temporada do Hermitcraft com sua comunidade favorita.",
      price: 0.0,
      image: "images/produtos/imagem7.png",
    },
    {
      name: "Horses+",
      description:
        "Adicione cavalos únicos ao seu mundo, incluindo raças místicas e com habilidades especiais.",
      price: 490.0,
      image: "images/produtos/imagem8.png",
    },
    {
      name: "One Block",
      description:
        "Comece em um único bloco e construa tudo a partir dele! Um dos desafios mais famosos do Minecraft.",
      price: 490.0,
      image: "images/produtos/imagem9.png",
    },
    {
      name: "A Minecraft Movie DLC",
      description:
        "Pacote oficial do filme com skins e aventuras dos personagens das telonas.",
      price: 0.0,
      image: "images/produtos/imagem10.png",
    },
    {
      name: "Young Gru",
      description:
        "A skin do jovem Gru chegou para dominar o mundo dos blocos com estilo.",
      price: 0.0,
      image: "images/produtos/imagem11.png",
    },
    {
      name: "A Minecraft Movie Hero Pack",
      description:
        "Skins heroicas para fãs do universo cinematográfico Minecraft!",
      price: 0.0,
      image: "images/produtos/imagem12.png",
    },
    {
      name: "Blue Jeans",
      description:
        "Estilo casual e moderno com esse pacote de skins temáticas em jeans.",
      price: 310.0,
      image: "images/produtos/imagem13.png",
    },
    {
      name: "Crafty Costumes",
      description:
        "Entre no clima de Halloween com fantasias criativas para seu avatar.",
      price: 0.0,
      image: "images/produtos/imagem14.png",
    },
    {
      name: "Bloom",
      description:
        "Pacote fofo e florido para quem curte cores suaves e skins criativas.",
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
