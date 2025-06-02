FROM node:23-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "serve"]