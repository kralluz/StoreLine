/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const candidatePaths = [
    path.join(process.cwd(), ".env"),
    path.join(__dirname, "..", ".env"),
  ];

  for (const candidatePath of candidatePaths) {
    if (!fs.existsSync(candidatePath)) {
      continue;
    }

    const envFile = fs.readFileSync(candidatePath, "utf8");
    for (const line of envFile.split(/\r?\n/)) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      let value = trimmedLine.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key === "DATABASE_URL" && value) {
        process.env.DATABASE_URL = value;
        return value;
      }
    }
  }

  throw new Error("DATABASE_URL nao definida. Configure o ambiente antes de executar o seed.");
}

loadDatabaseUrl();

const prisma = new PrismaClient();

const passwordHash = (password) => bcrypt.hashSync(password, 10);
const decimal = (value) => new Prisma.Decimal(value);

const users = [
  {
    id: "user_seed_admin",
    name: "Ana Administradora",
    email: "admin@storeline.local",
    password: "Admin@123",
    role: "ADMIN",
  },
  {
    id: "user_seed_maria",
    name: "Maria Silva",
    email: "maria@storeline.local",
    password: "Maria@123",
    role: "USER",
  },
  {
    id: "user_seed_joao",
    name: "Joao Santos",
    email: "joao@storeline.local",
    password: "Joao@123",
    role: "USER",
  },
];

const products = [
  {
    id: "product_seed_camiseta",
    name: "Blusao Em Moletom Com Bordado",
    description: "Blusao bordado em moletom de viscose com elastano. Acabamento rico e expressivo.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1942821/lezalez-1.7893E-000853-C1.jpg.jpg",
    price: "379.90",
    stock: 30,
    isActive: true,
  },
  {
    id: "product_seed_mochila",
    name: "Calca Pantalona De Cintura Alta Em Moletom",
    description: "Calca pantalona de cintura alta em moletom confortavel.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1935374/lezalez-1.7478E-019424-C1.jpg.jpg",
    price: "399.90",
    stock: 25,
    isActive: true,
  },
  {
    id: "product_seed_fone",
    name: "Calca Com Bolsos De Cintura Alta Em Alfaiataria",
    description: "Calca de alfaiataria com bolsos e cintura alta.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1283473/lezalez-1.jpg",
    price: "399.90",
    stock: 18,
    isActive: true,
  },
  {
    id: "product_seed_caderno",
    name: "Blusa De Mangas Curtas Em Malha De Trico",
    description: "Blusa de mangas curtas em malha de trico para o dia a dia.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2375562/lezalez-1.7700E-011015-C1.jpg.jpg",
    price: "249.90",
    stock: 40,
    isActive: true,
  },
  {
    id: "product_seed_organizador",
    name: "Saia Jeans Longa De Cintura Alta",
    description: "Saia jeans longa de cintura alta com modelagem moderna.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2571185/lezalez-1.1005E-008878-C1.jpg.jpg",
    price: "599.90",
    stock: 15,
    isActive: true,
  },
  {
    id: "product_seed_tenis",
    name: "Calca Reta Jeans De Cintura Alta Com Elastano",
    description: "Calca reta jeans de cintura alta com elastano para conforto.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2372786/lezalez-1.0941E-003336-C1.jpg.jpg",
    price: "399.90",
    stock: 22,
    isActive: true,
  },
  {
    id: "product_seed_relogio",
    name: "Blusa Regata De Alcas Finas Estampada",
    description: "Blusa regata estampada com alcas finas, ideal para o verao.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2425010/lezalez-1.3520E-Y2701D-C1.jpg.jpg",
    price: "114.95",
    stock: 50,
    isActive: true,
  },
  {
    id: "product_seed_garrafa",
    name: "Vestido Estampado Curto Com Decote Em V",
    description: "Vestido curto estampado com decote em V elegante.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2426009/lezalez-1.3567E-Y2631D-C1.jpg.jpg",
    price: "199.95",
    stock: 32,
    isActive: true,
  },
  {
    id: "product_seed_teclado",
    name: "Blusa T-shirt Com Estampa Localizada",
    description: "Blusa t-shirt com estampa localizada de mangas curtas.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2434758/lezalez-1.5311E-001142-C1.jpg.jpg",
    price: "74.95",
    stock: 60,
    isActive: true,
  },
  {
    id: "product_seed_mouse",
    name: "Vestido Curto Com Bordado Em Malha Canelada",
    description: "Vestido curto em malha canelada essential com bordado.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1627831/lezalez-1.5303E-000822-C1.jpg.jpg",
    price: "124.95",
    stock: 28,
    isActive: true,
  },
  {
    id: "product_seed_monitor",
    name: "Blusa Em Malha Canelada Com Bordado Na Manga",
    description: "Blusa em malha canelada com bordado delicado na manga.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1624407/lezalez-1.5060E-011015-C1.jpg.jpg",
    price: "89.94",
    stock: 45,
    isActive: true,
  },
  {
    id: "product_seed_cafeteira",
    name: "Blusa Regata Basica Com Bordado Em Malha Canelada",
    description: "Blusa regata basica em malha canelada com bordado discreto.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1624855/lezalez-1.5071E-001142-C1.jpg.jpg",
    price: "99.95",
    stock: 55,
    isActive: true,
  },
  {
    id: "product_seed_oculos",
    name: "Vestido Curto Estampado Com Um Ombro So",
    description: "Vestido curto estampado com modelagem assimetrica de um ombro so.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2426323/lezalez-1.3583E-Y2701D-C1.jpg.jpg",
    price: "224.95",
    stock: 20,
    isActive: true,
  },
  {
    id: "product_seed_livro",
    name: "Vestido Curto De Alcas Com Argolas",
    description: "Vestido curto de alcas com detalhes em argolas.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2426257/lezalez-1.3579E-011015-C1.jpg.jpg",
    price: "299.95",
    stock: 18,
    isActive: true,
  },
  {
    id: "product_seed_vestido_longo",
    name: "Vestido De Manga Longa Estampado Com Faixa",
    description: "Vestido de manga longa estampado com faixa marcando a cintura.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2396434/lezalez-1.9576E-Y3521S-C1.jpg.jpg",
    price: "899.90",
    stock: 10,
    isActive: true,
  },
  {
    id: "product_seed_vestido_cha",
    name: "Vestido Cha Com Franzidos Em Malha Tule",
    description: "Vestido cha com franzidos em malha tule, peca delicada.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/1942238/lezalez-1.7726E-000156-C1.jpg.jpg",
    price: "399.90",
    stock: 14,
    isActive: true,
  },
  {
    id: "product_seed_jaqueta",
    name: "Jaqueta Em Pu Com Ziperes",
    description: "Jaqueta em PU com ziperes funcionais, visual urbano.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2378732/lezalez-1.7321E-000156-C1.jpg.jpg",
    price: "699.90",
    stock: 12,
    isActive: true,
  },
  {
    id: "product_seed_vestido_sobrep",
    name: "Vestido Longo Com Sobreposicao",
    description: "Vestido longo elegante com sobreposicao.",
    imageUrl: "https://lunelli.vteximg.com.br/arquivos/ids/2296447/lezalez-1.7873E-019424-C1.jpg.jpg",
    price: "799.90",
    stock: 8,
    isActive: true,
  },
];

const carts = [
  {
    id: "cart_seed_admin",
    userId: "user_seed_admin",
    items: [
      { id: "cart_item_seed_admin_1", productId: "product_seed_camiseta", quantity: 2 },
      { id: "cart_item_seed_admin_2", productId: "product_seed_organizador", quantity: 1 },
    ],
  },
  {
    id: "cart_seed_maria",
    userId: "user_seed_maria",
    items: [
      { id: "cart_item_seed_maria_1", productId: "product_seed_fone", quantity: 1 },
      { id: "cart_item_seed_maria_2", productId: "product_seed_caderno", quantity: 3 },
    ],
  },
  {
    id: "cart_seed_joao",
    userId: "user_seed_joao",
    items: [
      { id: "cart_item_seed_joao_1", productId: "product_seed_mochila", quantity: 1 },
      { id: "cart_item_seed_joao_2", productId: "product_seed_camiseta", quantity: 1 },
    ],
  },
];

const orders = [
  {
    id: "order_seed_admin_1",
    userId: "user_seed_admin",
    status: "CONFIRMED",
    createdAt: new Date("2026-04-02T10:00:00.000Z"),
    items: [
      { id: "order_item_seed_admin_1", productId: "product_seed_camiseta", quantity: 1, unitPrice: "379.90" },
      { id: "order_item_seed_admin_2", productId: "product_seed_organizador", quantity: 1, unitPrice: "599.90" },
    ],
  },
  {
    id: "order_seed_maria_1",
    userId: "user_seed_maria",
    status: "CONFIRMED",
    createdAt: new Date("2026-04-08T14:30:00.000Z"),
    items: [
      { id: "order_item_seed_maria_1", productId: "product_seed_fone", quantity: 1, unitPrice: "399.90" },
      { id: "order_item_seed_maria_2", productId: "product_seed_caderno", quantity: 2, unitPrice: "249.90" },
    ],
  },
  {
    id: "order_seed_joao_1",
    userId: "user_seed_joao",
    status: "CANCELLED",
    createdAt: new Date("2026-04-12T19:15:00.000Z"),
    items: [
      { id: "order_item_seed_joao_1", productId: "product_seed_mochila", quantity: 1, unitPrice: "399.90" },
    ],
  },
];

async function upsertUser(user) {
  return prisma.user.upsert({
    where: { id: user.id },
    update: {
      name: user.name,
      email: user.email,
      passwordHash: passwordHash(user.password),
      role: user.role,
    },
    create: {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: passwordHash(user.password),
      role: user.role,
    },
  });
}

async function upsertProduct(product) {
  return prisma.product.upsert({
    where: { id: product.id },
    update: {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: decimal(product.price),
      stock: product.stock,
      isActive: product.isActive,
    },
    create: {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: decimal(product.price),
      stock: product.stock,
      isActive: product.isActive,
    },
  });
}

async function upsertCart(cart) {
  return prisma.cart.upsert({
    where: { id: cart.id },
    update: { userId: cart.userId },
    create: { id: cart.id, userId: cart.userId },
  });
}

async function upsertCartItem(cartId, item) {
  return prisma.cartItem.upsert({
    where: { id: item.id },
    update: {
      cartId,
      productId: item.productId,
      quantity: item.quantity,
    },
    create: {
      id: item.id,
      cartId,
      productId: item.productId,
      quantity: item.quantity,
    },
  });
}

async function upsertOrder(order) {
  const subtotal = order.items.reduce((accumulator, item) => {
    return accumulator.add(decimal(item.unitPrice).mul(item.quantity));
  }, decimal("0"));

  return prisma.order.upsert({
    where: { id: order.id },
    update: {
      userId: order.userId,
      status: order.status,
      subtotal,
      total: subtotal,
      createdAt: order.createdAt,
    },
    create: {
      id: order.id,
      userId: order.userId,
      status: order.status,
      subtotal,
      total: subtotal,
      createdAt: order.createdAt,
    },
  });
}

async function upsertOrderItem(orderId, item) {
  const lineSubtotal = decimal(item.unitPrice).mul(item.quantity);

  return prisma.orderItem.upsert({
    where: { id: item.id },
    update: {
      orderId,
      productId: item.productId,
      productName: products.find((product) => product.id === item.productId)?.name ?? item.productId,
      unitPrice: decimal(item.unitPrice),
      quantity: item.quantity,
      lineSubtotal,
    },
    create: {
      id: item.id,
      orderId,
      productId: item.productId,
      productName: products.find((product) => product.id === item.productId)?.name ?? item.productId,
      unitPrice: decimal(item.unitPrice),
      quantity: item.quantity,
      lineSubtotal,
    },
  });
}

async function main() {
  console.log("Seeding demo data...");

  for (const product of products) {
    await upsertProduct(product);
  }

  for (const user of users) {
    await upsertUser(user);
  }

  for (const cart of carts) {
    await upsertCart(cart);
    for (const item of cart.items) {
      await upsertCartItem(cart.id, item);
    }
  }

  for (const order of orders) {
    await upsertOrder(order);
    for (const item of order.items) {
      await upsertOrderItem(order.id, item);
    }
  }

  console.log("Seed concluido com usuarios, produtos, carrinhos e historico de compras.");
}

main()
  .catch((error) => {
    console.error("Falha ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });