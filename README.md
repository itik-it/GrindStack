# 🛒 GrindStack - Microservices E-Commerce App

GrindStack is a full-stack microservices-based eCommerce platform built using the MERN stack, RabbitMQ for messaging, and Docker for containerized deployment.

---

## 📦 Project Structure

GrindStack/
├── services/
│ ├── user-service/
│ ├── product-service/
│ ├── cart-service/
│ └── order-service/
├── frontend/ # Vite + React UI (Shopify)
├── docker-compose.yml
├── .gitignore
└── .dockerignore


---

## 🚀 How to Run (Locally with Docker)

1. ✅ **Install Docker & Docker Compose**
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

2. 🧱 **Clone the project**
   ```bash
   git clone https://github.com/yourusername/grindstack.git
   cd grindstack

3. 🐳 Start everything
docker-compose up --build

4. 🌐 how to stop and update the docker
docker-compose down -- TO Stop Running services
docker-compose down -v  TO remove volumes (MongoDB data)
docker-compose restart - TO Apply Code Updates (without rebuilding images)
docker-compose up --build --force-recreate  TO Rebuild After Major Change
docker system prune -a --volumes TO Clean everthing