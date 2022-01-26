FROM node:16.13.2-alpine3.14 as build-stage

RUN mkdir -p /app

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY . /app

RUN npm ci
RUN npm run build


FROM node:16.13.2-alpine3.14 as production

ENV PORT=80
COPY --from=build-stage /app/ .
EXPOSE 80

CMD ["npm", "run", "start"]
