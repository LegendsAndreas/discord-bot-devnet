FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY index.js ./
COPY .env ./

RUN npm install

EXPOSE 3001

CMD [ "node", "index.js" ]