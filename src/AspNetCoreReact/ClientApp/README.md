# ClientApp

The React front-end for the `AspNetCoreReact` ASP.NET Core project. It is built
with [Vite](https://vite.dev/) and [React](https://react.dev/).

## Available scripts

Run these from this directory (`src/AspNetCoreReact/ClientApp`).

### `npm start`

Starts the Vite dev server on <https://localhost:44484>, which is the URL the
ASP.NET Core SPA proxy (`SpaProxyServerUrl` in `AspNetCoreReact.csproj`) expects.

The `prestart` script runs `aspnetcore-https.js`, which exports the ASP.NET Core
development certificate so the dev server can be served over HTTPS. Requests to
`/weatherforecast` are proxied to the ASP.NET Core backend.

### `npm test`

Runs the [Vitest](https://vitest.dev/) test suite once in a jsdom environment.

### `npm run lint`

Runs ESLint over `src/` using the flat config in `eslint.config.js`.

### `npm run build`

Creates a production build in `build/`. The `PublishRunWebpack` target in
`AspNetCoreReact.csproj` copies that folder into `wwwroot` on publish.

### `npm run preview`

Serves the contents of `build/` locally to sanity-check a production build.

## Progressive web app

A service worker is generated from `src/service-worker.js` by
[`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) in `injectManifest` mode.
It is not registered by default: `src/index.jsx` calls
`serviceWorkerRegistration.unregister()`. Swap that for `register()` to opt in.
