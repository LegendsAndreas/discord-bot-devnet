FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY src ./src
COPY .env ./

RUN npm install

EXPOSE 80

CMD [ "node", "." ]