#Dockerfile for fragment microservice

# STAGE 0
FROM node:16.15.1@sha256:a13d2d2aec7f0dae18a52ca4d38b592e45a45cc4456ffab82e5ff10d8a53d042 AS dependencies

LABEL maintainer="Aditya Rahman <arahman27@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV NODE_ENV=production

ENV PORT=8080

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY --from=dependencies ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start

EXPOSE 8080

########################################################################################
