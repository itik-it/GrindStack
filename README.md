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

3. 🐳 Start everything</br>
docker-compose up --build
</br>
4. 🌐 how to stop and update the docker</br>
docker-compose down --volumes --remove-orphans</br>
docker-compose build</br>
docker-compose up</br>
</br>
5. 🌐 to Check docker MongoDb</br>
Open new terminal</br>
input docker ps</br>
look for the container</br>
then type</br>
