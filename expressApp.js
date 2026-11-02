import express from "express";

const app = express();

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
  res.status(200).json(cart);
});

app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    ...product,
    total: product.price * product.quantity,
  });
});

app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (
    id === undefined ||
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !category
  ) {
    return res.status(400).json({
      message: "All product fields are required",
    });
  }

  const newProduct = {
    id,
    productName,
    price,
    quantity,
    category,
  };

  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
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

  const { productName, price, quantity, category } = req.body;

  if (
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !category
  ) {
    return res.status(400).json({
      message: "All product fields are required",
    });
  }

  product.productName = productName;
  product.price = price;
  product.quantity = quantity;
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

  const deletedProduct = cart.splice(index, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct[0],
  });
});

app.listen(4000, () => {
  console.log("Express server running at http://localhost:4000");
});
