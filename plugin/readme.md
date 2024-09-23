# project-title

project-description

## Getting started

Prerequisites: [Git](https://git-scm.com/), [Node](https://nodejs.org/en/) (version 18 and above) or [Bun](https://bun.sh)

```sh
git clone git@bitbucket.org:tangibleinc/project-name.git
cd project-name
npm install
```

## Develop

#### Build for development

Build, watch files for changes and rebuild.

```sh
npm run start
```

It starts a local development site using [`wp-now`](https://github.com/WordPress/playground-tools/blob/trunk/packages/wp-now/README.md).

#### Build for production

```sh
npm run build
```

#### Format

Format source code with [Prettier](https://prettier.io).

```sh
npm run format
```

## Local environment

Optionally, create a file named `.wp-env.override.json` to customize the WordPress environment. This file is listed in `.gitignore` so it's local to your setup.

Mainly it's useful for mounting local folders into the virtual file system. For example, to link another plugin in the parent directory:

```json
{
  "mappings": {
    "wp-content/plugins/example-plugin": "../example-plugin"
  }
}
```
