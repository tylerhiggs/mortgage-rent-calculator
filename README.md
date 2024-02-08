# [Compare Mortgage and Rent](https://mortgage-and-rent-calculator.web.app/)

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Deployment

This project is deployed to [Firebase](https://firebase.google.com/). Deployment happens automatically when a commit is pushed to the `main` branch.

## Icons

Icons are from [Heroicons](https://heroicons.com/).

## [Tailwind CSS](https://tailwindcss.com/)

This project uses Tailwind CSS for styling. The configuration file is located at [tailwind.config.js](./tailwind.config.js).

## Component Library

This project uses [Headless UI](https://headlessui.dev/) for components. They are completely unstyled and meant to be used as a base for custom components and styled with Tailwind CSS.

# Equations

## Mortgage

### Monthly Payment

$$M = P \times \frac{r(1 + r)^n}{(1 + r)^n - 1}$$

Where $M$ is the monthly mortgage payment, $P$ is the principal (what was borrowed for the home), $r$ is the monthly interest rate (divide annual rate by 12), and $n$ is the number of months.

### Monthly Interest (Averaged)

$$I_m = M - \frac{P}{n}$$

Where $I_m$ is the averaged monthly interest payment over the course of the entire mortgage, $P$ is the principal, and $r$ is the monthly interest rate. The actual amount that goes towards interest will decrease over time as the mortgage is paid off and the interest added every month is decreased.

## Future IRA Value

$$\text{Future IRA Value} = \sum_{i = 0}^{n-1} x(1 + r)^i = \frac{x((1 + r)^n - 1)}{r} | r \neq 0$$

Where $x$ is the annual contribution, $r$ is the annual interest rate, and $n$ is the number of years.We can express this in terms of the present value of the IRA $P_{I}$ as well:

$$\text{Future IRA Value} = P_{I} (1 + r)^n + \frac{x((1 + r)^n - 1)}{r} | r \neq 0$$

We can express this in terms of monthly contributions as well:

$$\text{Future IRA Value} = P_I (1 + r)^n +  \frac{x((1 + r/12)^{12n} - 1)}{r/12} | r \neq 0$$

Where $x$ is the monthly contribution, $r$ is the annual interest rate, and $n$ is the number of years.
