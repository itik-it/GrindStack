FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev nodemon

COPY . .   

EXPOSE 5002

CMD ["npx", "nodemon", "index.js"]
