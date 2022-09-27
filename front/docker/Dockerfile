FROM node:16.11.1-alpine

ARG NODE_ENV=production
ARG PORT=80

EXPOSE ${PORT}

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "run", "start"]
