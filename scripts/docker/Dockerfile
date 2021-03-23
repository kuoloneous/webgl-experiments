FROM node:10.16.3-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN mkdir /app
WORKDIR /app
COPY package.json /app

RUN npm install
COPY . /app

# copy .env file and shell script to container
COPY ./env.sh /app
#COPY .env /app

RUN apk add --no-cache --upgrade bash

# Make our shell script executable
RUN chmod +x env.sh
RUN npm config set unsafe-perm true
RUN ./env.sh 
EXPOSE 3000
RUN npm run build
CMD ["npm", "start"]
