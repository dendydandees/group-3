FROM node:16.13.2-alpine3.14 as builder

RUN mkdir -p /app

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY . /app

# sometimes there will be a timeout error, this is the fix
# https://stackoverflow.com/a/48750051
RUN npm cache verify

RUN npm ci

RUN npm run build

FROM node:16.13.2-alpine3.14 as runner

WORKDIR /app

COPY --from=builder /app  .

ARG NUXT_PROXY
ENV NUXT_PROXY ${NUXT_PROXY}
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=80

EXPOSE 80

CMD [ "npm", "run", "start" ]
