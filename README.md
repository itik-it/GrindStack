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
docker-compose down --volumes --remove-orphans
docker-compose build
docker-compose up

5. 🌐 to Check docker MongoDb
Open new terminal
input docker ps
look for the container
then type

docker exec -it <container_name_or_id> mongosh
or
docker exec -it <container_name_or_id> mongo
then type
show dbs
use your_db
db.your_collection.find()