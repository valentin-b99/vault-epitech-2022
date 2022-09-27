FROM strapi/base:14-alpine

ARG NODE_ENV=production
ARG PORT=80

EXPOSE ${PORT}

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /srv/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY ./ ./

CMD sh docker/docker.sh
