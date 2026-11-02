import http from "http";

import fs from "fs";

let cart = [
  {
    id: 1,
    productName: "Laptop",
    price: 50000,
    quantity: 1,
  },
  {
    id: 2,
    productName: "Mouse",
    price: 500,
    quantity: 2,
  },
];

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Welcome to Shopping Cart</h1>");
  } else if (req.url === "/cart" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(cart));
  } else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(
      "<h1>About Shopping Cart Application</h1><p>This application manages shopping cart products.</p>",
    );
  } else if (req.url === "/home" && req.method === "GET") {
    fs.readFile("./public/index.html", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        return res.end("Error loading HTML file");
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      res.end(data);
    });
  } else if (req.url === "/add-to-cart" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        if (!body.trim()) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          return res.end(
            JSON.stringify({
              message: "Request body cannot be empty",
            }),
          );
        }

        const product = JSON.parse(body);

        if (
          product.id === undefined ||
          !product.productName ||
          product.price === undefined ||
          product.quantity === undefined
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          return res.end(
            JSON.stringify({
              message: "All product fields are required",
            }),
          );
        }

        if (
          !Number.isFinite(Number(product.id)) ||
          !Number.isFinite(Number(product.price)) ||
          !Number.isFinite(Number(product.quantity)) ||
          Number(product.price) < 0 ||
          Number(product.quantity) <= 0
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          return res.end(
            JSON.stringify({
              message: "Please enter valid numeric values",
            }),
          );
        }

        if (cart.some((item) => item.id === Number(product.id))) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          return res.end(
            JSON.stringify({
              message: "Product ID already exists",
            }),
          );
        }

        const newProduct = {
          id: Number(product.id),
          productName: product.productName,
          price: Number(product.price),
          quantity: Number(product.quantity),
        };

        cart.push(newProduct);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Product added to cart successfully",
            cart: cart,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON data",
          }),
        );
      }
    });
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "404 - Page Not Found",
      }),
    );
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
