FROM node:16-alpine

WORKDIR /app
COPY package.json ./
run npm install
COPY ./ ./

CMD ["npm", "start"]