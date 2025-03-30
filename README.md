# VMkit Monorepo

Getting started with VMkit Monorepo

## Understanding the layout

The monorepo is split into 4 main sections:

- root
  - apps
  - packages

### root

The root directory contains the `package.json` file for the monorepo. The root directory contains the scripts folder which builds components, icons, etc that other workspaces depend on. It also contains the `yarn.lock` file which is used to lock the versions of all dependencies in the monorepo.

### apps

The apps directory contains all the applications (web templates) that are part of the monorepo. Each application is a separate directory.

### packages

The packages directory contains all the packages (npm packages) that are part of the monorepo. Each package is a separate directory.

## Getting Started

### apps/web

copy the `.env.example` file to `.env` and fill in the values.

### apps/workbench/concrete

copy the `.env.example` file to `.env` and fill in the values.

## Development

run `yarn install` in the root directory to install all dependencies.
run `yarn setup` in the root directory to init icons and ui components and hardhat with .env contract.
