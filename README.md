# Client Portal

The client portal is the front end that Luwjistik clients use to interact with the Luwjistik platform. It may include basic functionalities like uploading orders, connecting to partners (and confirming connection as a partner), managing their credentials, controlling the order allocation rules, etc. ([Client Portal Overview](https://luwjistik.slab.com/posts/systems-overview-7210vab3#ha76d-clients-portal))

## Demo

[dev/staging](http://dev.luwjistik.io/)

[beta/sandbox](http://sandbox.luwjistik.io/)

## Environment Variables

To start the local development server, simply run `npm run dev`. This will start the development server based on environtment variabel `PORT` in `.env` file.

All API calls are sent to the same origin as the frontend server. On the production deployment, the server will be setup to redirect the traffic accordingly.
On local environment, the development server will proxy any unknown requests to a backend server as well.

By default, this will proxy the requests to `http://localhost:8080`, assuming you have the backend server running on your local environment on port `8080` as well.
To change this behaviour, copy the `.env.example` file to `.env`, and change the `PROXY` line to point to the backend server that you'd like to use (e.g. `https://admin.dev.luwjistik.io` for the staging server).

## Run Locally

Clone the project

```bash
  git clone https://gitlab.com/luwjistik1/client-portal.git

  # or with ssh
  git clone git@gitlab.com:luwjistik1/client-portal.git
```

Go to the project directory

```bash
  cd client-portal
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev

  # build for production and launch server
  $ npm run build
  $ npm run start
```

## Contributing

1. Pull latest `main` branch

```shell
$ git checkout main

$ git pull origin main
```

2. Create new feature/bug branch

```shell
$ git checkout -b <new-feature>
```

3. Push feature branch to remote repository

```shell
$ git push origin --set-upstream origin <new-feature>
```

4. Create merge request, on gitlab

5. Ask for approval by one or more engineers

6. Merge and delete `<new-feature>` branch

## Documentation

[Nuxt.js](https://nuxtjs.org/)

[Vuetify](https://vuetifyjs.com/en/)

[Nuxt Composition API](https://composition-api.nuxtjs.org/)

[Nuxt Typescript](https://typescript.nuxtjs.org/)

[Nuxt Auth](https://auth.nuxtjs.org/)

[Nuxt Axios](https://axios.nuxtjs.org/)

## Tech Stack

**Client:** Nuxt.js, Vuex, Vuetify

**Server:** Node
