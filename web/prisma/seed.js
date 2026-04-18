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
    name: "Camiseta Algodao",
    description: "Camiseta basica de algodao premium.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    price: "59.90",
    stock: 40,
    isActive: true,
  },
  {
    id: "product_seed_mochila",
    name: "Mochila Urbana",
    description: "Mochila resistente para uso diario.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    price: "149.90",
    stock: 18,
    isActive: true,
  },
  {
    id: "product_seed_fone",
    name: "Fone Bluetooth",
    description: "Fone sem fio com bateria prolongada.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    price: "219.00",
    stock: 25,
    isActive: true,
  },
  {
    id: "product_seed_caderno",
    name: "Caderno Inteligente",
    description: "Caderno com divisorias para estudo e trabalho.",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    price: "39.50",
    stock: 60,
    isActive: true,
  },
  {
    id: "product_seed_organizador",
    name: "Organizador de Mesa",
    description: "Kit para organizar mesa e cabos.",
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80",
    price: "74.90",
    stock: 30,
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
      { id: "order_item_seed_admin_1", productId: "product_seed_camiseta", quantity: 1, unitPrice: "59.90" },
      { id: "order_item_seed_admin_2", productId: "product_seed_organizador", quantity: 1, unitPrice: "74.90" },
    ],
  },
  {
    id: "order_seed_maria_1",
    userId: "user_seed_maria",
    status: "CONFIRMED",
    createdAt: new Date("2026-04-08T14:30:00.000Z"),
    items: [
      { id: "order_item_seed_maria_1", productId: "product_seed_fone", quantity: 1, unitPrice: "219.00" },
      { id: "order_item_seed_maria_2", productId: "product_seed_caderno", quantity: 2, unitPrice: "39.50" },
    ],
  },
  {
    id: "order_seed_joao_1",
    userId: "user_seed_joao",
    status: "CANCELLED",
    createdAt: new Date("2026-04-12T19:15:00.000Z"),
    items: [
      { id: "order_item_seed_joao_1", productId: "product_seed_mochila", quantity: 1, unitPrice: "149.90" },
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