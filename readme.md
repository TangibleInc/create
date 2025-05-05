# Create Tangible

A command-line tool to quickly set up new projects based on templates.

## Usage

Prerequisites: Linux, macOS, or [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/about); [Git](https://git-scm.com/), [Node](https://nodejs.org/en/) (version 20 and above)

Run the tool to create a new project.

```sh
npm create tangible@latest
```

It asks for project name and type, such as plugin, theme, static site. Then it creates a folder with basic setup prepared.

## Project templates

Here are the project templates available.

- WordPress plugin, theme, or site
- Static HTML site

They're based on the following shared libraries.

- [Roller](https://github.com/TangibleInc/tangible-roller) to compile Sass/TypeScript/JSX
- [Framework](https://github.com/TangibleInc/framework/) - Common plugin/theme features
- [Updater](https://github.com/TangibleInc/updater) - Plugin/theme updater to integrate with Update Server
- [`wp-now`](https://github.com/WordPress/playground-tools/tree/trunk/packages/wp-now#readme) for local development with minimal requirement (Node or Bun)
