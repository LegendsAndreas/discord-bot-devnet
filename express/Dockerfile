FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY express.js ./
COPY .env ./

RUN npm install

EXPOSE 8080

CMD [ "node", "express.js" ]