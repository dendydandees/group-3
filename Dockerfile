FROM node:16.13.2-alpine3.14

RUN mkdir -p /app

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git


COPY . /app

# sometimes there will be a timeout error, this is the fix
# https://stackoverflow.com/a/48750051
RUN npm cache verify


RUN npm install

RUN npm run build

EXPOSE 8080

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8080

CMD ["npm", "start"]
