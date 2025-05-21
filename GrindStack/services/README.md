# Order API

This is a Node.js microservice for creating orders. It uses **Express.js**, **MongoDB**, and publishes `OrderPlaced` events using **RabbitMQ**. The project follows **SOLID principles** and includes **Swagger documentation**.

---

## 📦 Features

- Create and retrieve orders
- Publishes `OrderPlaced` event
- MongoDB integration
- Swagger (OpenAPI) docs at `/api-docs`

---

## 🚀 Installation

```bash
npm install
npm start
```

> Make sure MongoDB and RabbitMQ are running locally.

---

## 🌐 API Endpoints

| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | `/api/orders`    | Create new order   |
| GET    | `/api/orders`    | Get all orders     |
| GET    | `/api/orders/:id`| Get order by ID    |

---

## 🛠 Technologies

- Express.js
- MongoDB (Mongoose)
- RabbitMQ (amqplib)
- Swagger (swagger-jsdoc, swagger-ui-express)

---

## 📘 Swagger Docs

Run the server and go to:  
```
http://localhost:4000/api-docs
```

---

## 📡 RabbitMQ

- Queue: `OrderPlaced`
- Used to notify other services (e.g., Product Service) of new orders

Make sure RabbitMQ is running on:

```
amqp://localhost
```

You can customize the URL with auth:

```
amqp://username:password@hostname:5672/
```

---

## 🧱 Project Structure

```
controllers/
routes/
services/
repositories/
models/
events/
config/
```

---

## 🔑 License

MIT
# Product API

This is a Node.js microservice for managing products. It uses **Express.js**, **MongoDB**, and listens to **RabbitMQ** events. The project follows **SOLID principles** and includes **Swagger documentation**.

---

## 📦 Features

- Create, Read, Delete products
- Update product stock
- Listen to `OrderPlaced` events via RabbitMQ
- MongoDB integration
- Swagger (OpenAPI) docs at `/api-docs`

---

## 🚀 Installation

```bash
npm install
npm start
```

> Make sure MongoDB and RabbitMQ are running locally.

---

## 🌐 API Endpoints

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | `/api/products`          | Get all products      |
| GET    | `/api/products/:id`      | Get product by ID     |
| POST   | `/api/products`          | Create a product      |
| DELETE | `/api/products/:id`      | Delete a product      |
| PATCH  | `/api/products/:id/stock`| Update stock quantity |

---

## 🛠 Technologies

- Express.js
- MongoDB (Mongoose)
- RabbitMQ (amqplib)
- Swagger (swagger-jsdoc, swagger-ui-express)

---

## 📘 Swagger Docs

Run the server and go to:  
```
http://localhost:3000/api-docs
```

---

## 📡 RabbitMQ

- Queue: `OrderPlaced`
- Used to update stock when an order is placed

Make sure RabbitMQ is running on:

```
amqp://localhost
```

You can customize the URL with auth:

```
amqp://username:password@hostname:5672/
```

---

## 🧱 Project Structure

```
controllers/
routes/
services/
repositories/
models/
events/
config/
```

---

## 🔑 License

MIT
