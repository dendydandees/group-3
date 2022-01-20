FROM node:16.13.2-alpine3.14 as build-stage

ENV NODE_ENV=production

RUN mkdir -p /app

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git


COPY . /app

# sometimes there will be a timeout error, this is the fix
# https://stackoverflow.com/a/48750051
RUN npm cache verify


RUN npm install

RUN npm run generate

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN chown nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
