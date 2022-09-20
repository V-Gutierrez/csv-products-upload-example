FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./

RUN apk add g++ make py3-pip && npm install && rm -rf /var/cache/apk/*

COPY . .

EXPOSE 80

CMD ["ash", "-c", "npm run build && npm run update:db && npm run start"]