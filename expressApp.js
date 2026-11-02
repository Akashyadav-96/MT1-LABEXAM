import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let cart = [
  {
    id: 1,
    productName: "Laptop",
    price: 50000,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Mouse",
    price: 500,
    quantity: 2,
    category: "Accessories",
  },
  {
    id: 3,
    productName: "Keyboard",
    price: 1500,
    quantity: 1,
    category: "Accessories",
  },
];

app.get("/cart", (req, res) => {
  res.status(200).json({
    message: "All cart products",
    cart: cart,
  });
});

app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const total = product.price * product.quantity;

  res.status(200).json({
    message: "Product found successfully",
    product: product,
    total: total,
  });
});

app.post("/cart", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Please send product data in JSON format",
    });
  }

  const { id, productName, price, quantity, category } = req.body;

  if (
    id === undefined ||
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !category
  ) {
    return res.status(400).json({
      message:
        "All fields are required: id, productName, price, quantity, category",
    });
  }

  if (cart.some((item) => item.id === Number(id))) {
    return res.status(400).json({
      message: "Product ID already exists",
    });
  }

  if (
    !Number.isFinite(Number(id)) ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(quantity)) ||
    Number(price) < 0 ||
    Number(quantity) <= 0
  ) {
    return res.status(400).json({
      message: "ID, price and quantity must have valid numeric values",
    });
  }

  const newProduct = {
    id: Number(id),
    productName,
    price: Number(price),
    quantity: Number(quantity),
    category,
  };

  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
    total: newProduct.price * newProduct.quantity,
  });
});

app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  if (!req.body) {
    return res.status(400).json({
      message: "Please send updated product data in JSON format",
    });
  }

  const { productName, price, quantity, category } = req.body;

  if (
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !category
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(quantity)) ||
    Number(price) < 0 ||
    Number(quantity) <= 0
  ) {
    return res.status(400).json({
      message: "Price and quantity must have valid numeric values",
    });
  }

  product.productName = productName;
  product.price = Number(price);
  product.quantity = Number(quantity);
  product.category = category;

  res.status(200).json({
    message: "Product updated successfully",
    product: product,
    total: product.price * product.quantity,
  });
});

app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = cart.splice(index, 1)[0];

  res.status(200).json({
    message: "Product deleted successfully",
    deletedProduct: deletedProduct,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
