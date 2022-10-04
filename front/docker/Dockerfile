FROM node:16.11.1-alpine

ARG NODE_ENV=production
ARG PORT=80

EXPOSE ${PORT}

WORKDIR /src

COPY package*.json ./
RUN npm install

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY ./ ./

CMD ["npm", "run", "start"]
