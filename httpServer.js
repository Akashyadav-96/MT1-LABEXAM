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
  console.log(req.url);

  // GET /
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Welcome to Shopping Cart</h1>");
  }

  // GET /cart
  else if (req.url === "/cart" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(cart));
  }

  // GET /about
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(
      "<h1>About Shopping Cart Application</h1><p>This application manages shopping cart products.</p>",
    );
  }

  // GET /home - Serve HTML file using FS
  else if (req.url === "/home" && req.method === "GET") {
    fs.readFile("./public/index.html", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        res.end("Error loading HTML file");
      } else {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });

        res.end(data);
      }
    });
  }

  // POST /add-to-cart
  else if (req.url === "/add-to-cart" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
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

        cart.push(product);

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
  }

  // Invalid routes
  else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 - Page Not Found");
  }
});

// Start HTTP server on port 3000
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
