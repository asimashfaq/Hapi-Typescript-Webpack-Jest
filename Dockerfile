# Dockerfile dedicated for deploying an API with integration to client.

FROM node:alpine

WORKDIR /api
COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3600

EXPOSE 3600

RUN npm run build

CMD ["node", "dist/main.bundle.js"]