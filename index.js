import path from 'path'
import { fileURLToPath } from 'url'
import { execSync, spawn } from 'child_process'

import fs from 'fs-extra' // https://github.com/jprichardson/node-fs-extra/
import { globby as glob } from 'globby' // https://github.com/sindresorhus/globby
import chalk from 'picocolors'
import createCaseConverter from './case.js'
import { prompt } from './prompt.js'

const changeCase = createCaseConverter()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function getPackageJson() {
  return await fs.readJson(path.join(__dirname, 'package.json'))
}

/**
 * Create project from template
 */
export async function createProject(options = {}) {
  const {
    defaultProjectName = '',
    cwd = process.cwd(),
    project: projectConfig,
  } = options

  // const pkg = await getPackageJson()
  // console.log(pkg.name, pkg.version)

  const questions = [
    {
      type: 'select',
      name: 'type',
      message: 'Select project type',
      choices: [
        {
          name: 'Static page with HTML/CSS/JS',
          value: 'site-roller',
        },
        {
          name: 'WordPress plugin',
          value: 'example-plugin',
        },
        {
          name: 'WordPress theme',
          value: 'example-theme',
        },
        {
          name: 'WordPress site using Docker',
          value: 'site-wp-docker',
        },
        {
          name: 'WordPress site using wp-now (experimental)',
          value: 'site-wp-now',
        },
      ],
    },
    {
      type: 'input',
      name: 'name',
      required: true,
      message:
        'Project name ' +
        chalk.gray('- Lowercase alphanumeric with optional dash "-"'),
      // when: (data) => (data.name ? false : true),
      default: (data) => data.name,
      validate: (value) => {
        return value && !value.startsWith('.') && !value.includes('..')
      },
      filter: (value) => changeCase.kebab(value),
    },
    {
      type: 'confirm',
      name: 'overwrite',
      message: 'Remove existing project?',
      when: async (data) => {
        const exists = await fs.pathExists(path.join(cwd, data.name))
        if (exists) {
          console.log(`Project folder "${data.name}" already exists`)
        }
        return exists
      },
      default: false,
      async after(data) {
        if (data.overwrite === false) {
          process.exit(1)
          return
        }
        // Value already sanitized in validate() of name question
        const projectPath = path.join(cwd, data.name)
        console.log('Remove', projectPath)
        await fs.rm(projectPath, {
          recursive: true,
        })
      },
    },
    {
      type: 'input',
      name: 'title',
      required: true,
      message: 'Project title ' + chalk.gray('- Press enter for default'),
      default: (data) => changeCase.title(data.name),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description ' + chalk.gray('- Can be empty'),
    },
  ]

  const project = {
    name: 'untitled',
    title: 'Untitled',
    description: '',
    ...(projectConfig ||
      (await prompt(questions, {
        name: defaultProjectName,
      }))),
  }

  const projectName = project.name
  const projectPath = path.join(cwd, projectName)

  const alias = {
    static: 'site-roller',
    plugin: 'example-plugin',
    theme: 'example-theme',
    site: 'site-wp-now', // TODO: Replace with site-wp-env
  }

  const projectTemplateType = alias[project.type] || project.type

  // Create project folder and copy template

  console.log(
    `Create project "${projectName}" ` +
      chalk.gray('- Press CTRL + C to quit at any time')
  )

  await fs.mkdir(projectPath, {
    recursive: true,
  })

  const templatePath = path.join(__dirname, projectTemplateType)

  if (!await fs.exists(templatePath)) {
    console.log('Template does not exist:', projectTemplateType)
    return
  }

  console.log('Copy template type', projectTemplateType)
  const ignore = [
    'build',
    'bun.lockb',
    '.gitkeep',
    'node_modules',
    'package-lock.json',
    'vendor',
  ]
  await fs.copy(templatePath, projectPath, {
    filter: (filePath) => {
      /**
       * Check file path relative to template folder, in case it's inside
       * node_modules.
       */
      const folders = path.relative(templatePath, filePath).split('/')
      for (const folder of folders) {
        if (ignore.includes(folder)) return false
      }
      return true
    },
  })

  const templateContext = {
    project,
    ...changeCase,
  }

  // plugin, theme, site
  const projectType = projectTemplateType.startsWith('site-')
    ? 'site'
    : projectTemplateType.startsWith('example-')
      ? projectTemplateType.replace('example-', '')
      : projectTemplateType

  console.log('Project type', projectType)
  /**
   * File extensions to process
   */
  const extensions = [
    'css',
    'html',
    'js',
    'json',
    'jsx',
    'md',
    'php',
    'scss',
    'ts',
    'tsx',
    'txt',
  ]
  for (const file of await glob(`**/*.{${extensions.join(',')}}`, {
    ignore: ['node_modules'],
    gitignore: true,
    cwd: projectPath,
  })) {
    const filePath = path.join(projectPath, file)

    let content = await fs.readFile(filePath, 'utf8')

    /**
     * Very simple format for placeholders, for convenience of
     * developing project templates directly. Previously used Eta with
     * `<% %>` which was often a syntax error in source files.
     */
    content = content
      // Descriptionn
      .replaceAll(`Description of example ${projectType}`, project.description)
      // Kebab case slug
      .replaceAll(`example-${projectType}`, project.name)
      // Title case
      .replaceAll(
        `Example ${projectType[0].toUpperCase() + projectType.slice(1)}`,
        project.title
      )
      // Snake case
      .replaceAll(`example_${projectType}`, changeCase.snake(project.name))
      // Constant case
      .replaceAll(
        `EXAMPLE_${changeCase.constant(projectType)}`,
        changeCase.constant(project.name)
      )

    await fs.writeFile(filePath, content)
  }

  const run = (command, options = { silent: false }) =>
    new Promise((resolve, reject) => {
      try {
        execSync(command, {
          stdio: options.silent ? null : 'inherit',
          cwd: projectPath,
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })

  const pluginPath = path.join(projectPath, 'example-plugin.php')
  if (await fs.exists(pluginPath)) {
    const entryFile = `${project.name}.php`
    console.log('Rename plugin entry file to', entryFile)
    await fs.rename(pluginPath, path.join(projectPath, entryFile))
    console.log('Create folder at vendor/tangible')
    await fs.mkdir(path.join(projectPath, 'vendor/tangible'), {
      recursive: true,
    })
  }

  console.log('Install dependencies')
  try {
    await run(`bun install`, { silent: true })
  } catch (e) {
    await run(`npm install --audit=false --loglevel=error`, { silent: true })
  }

  console.log(`
Start by running:
cd ${projectName}
npm run start`)
}
