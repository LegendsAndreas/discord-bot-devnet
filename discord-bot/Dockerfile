FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./
COPY src ./src
COPY .env ./

RUN npm install

EXPOSE 3001

CMD [ "node", "." ]