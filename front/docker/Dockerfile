FROM node:16.11.1-alpine

ARG NODE_ENV=production
ARG PORT=80

EXPOSE ${PORT}

WORKDIR /src

COPY package*.json ./
RUN npm install

RUN chown -R node.node /src/node_modules

COPY ./ ./

CMD ["npm", "run", "start"]
