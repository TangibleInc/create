import path from 'path'
import { fileURLToPath } from 'url'
import { execSync, spawn } from 'child_process'

import fs from 'fs-extra' // https://github.com/jprichardson/node-fs-extra/
import { globby as glob } from 'globby' // https://github.com/sindresorhus/globby
import chalk from 'picocolors'
import { Eta } from 'eta'
import createCaseConverter from './case.js'
import { prompt } from './prompt.js'

const changeCase = createCaseConverter()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Create project from template
 */
export async function createProject(options = {}) {
  const {
    defaultProjectName = '',
    cwd = process.cwd(),
    project: projectConfig,
  } = options

  const questions = [
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
      type: 'select',
      name: 'type',
      message: 'Select project type',
      choices: [
        {
          name: 'Static HTML Page',
          value: 'static',
        },
        // {
        //   name: 'WordPress site',
        //   value: 'site',
        // },
        // {
        //   name: 'WordPress plugin',
        //   value: 'plugin',
        // },
        // {
        //   name: 'WordPress theme',
        //   value: 'theme',
        // },
      ],
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

  // Create project folder and copy template

  console.log(
    `Create project "${projectName}" ` +
      chalk.gray('- Press CTRL + C to quit at any time')
  )

  await fs.mkdir(projectPath, {
    recursive: true,
  })

  const templatePath = path.join(__dirname, project.type)

  console.log('Copy template type', project.type)
  const ignore = [
    'build',
    'bun.lockb',
    'node_modules',
    'package-lock.json',
    'vendor',
  ]
  await fs.copy(templatePath, projectPath, {
    filter: (filePath) => {
      const folders = filePath.split('/')
      for (const folder of folders) {
        if (ignore.includes(folder)) return false
      }
      return true
    },
  })

  /**
   * Replace placeholders using Eta template engine
   */

  const templateContext = {
    project,
    ...changeCase,
  }

  // https://eta.js.org/docs/api
  const eta = new Eta({
    useWith: true,
    autoEscape: false,
    autoTrim: false,
  })
  const etaOptions = {
    async: true,
  }

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
    if (!content.includes('<%')) continue
    console.log('Process', file)

    // https://eta.js.org/docs/syntax/async

    try {
      const fn = await eta.compile(content, {
        ...etaOptions,
        // Support include() relative to tempate file
        async include(target) {
          const dirPath = path.dirname(filePath)
          // Resolve relative file path
          const targetFilePath = path.resolve(dirPath, target)
          try {
            return await fs.readFile(targetFilePath, 'utf8')
          } catch (e) {
            console.log(
              'Error building template',
              path.relative(projectPath, filePath)
            )
            console.error(e.message)
          }
          return ''
        },
      })
      content = await eta.renderAsync(fn, templateContext)
    } catch (e) {
      console.error(e)
      return
    }

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

  const pluginPath = path.join(projectPath, 'tangible-plugin.php')
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
  await run(`npm install --audit=false --loglevel=error`, { silent: true })

  console.log(`
Start by running:
cd ${projectName}
npm run start`)
}
