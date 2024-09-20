# Create Tangible

A command-line tool to quickly set up new projects based on templates.

## Usage

Prerequisites: Git and Node.js 18 or above

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

- [Roller](https://github.com/TangibleInc/tangible-roller) to bundle HTML/Sass/JS
- [Framework](https://github.com/TangibleInc/framework/) - Common plugin/theme feateures
- [Updater](https://github.com/TangibleInc/plugin-updater) - Plugin/theme updater to integrate with Update Server
- [`wp-now`](https://github.com/WordPress/playground-tools/tree/trunk/packages/wp-now#readme) for local development with minimal requirement (Node or Bun)
