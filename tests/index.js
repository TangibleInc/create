import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test, is, ok, run, throws } from 'testra'
import { createProject } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

;(async () => {
  const buildPath = path.join(__dirname, 'build')

  console.log('Prepare directory tests/build')

  await fs.mkdir(buildPath, {
    recursive: true,
  })

  test('static', async () => {

    const name = 'test-site'
    const title = 'Static HTML site'
    const description = 'Description for site'

    await createProject({
      cwd: buildPath,
      project: {
        type: 'site-static-roller',
        name,
        title,
        description,
        overwrite: true,
      },
    })

    ok(true, 'create static site')

    const folder = path.join(buildPath, name)
    ok(await fs.exists(folder), 'site folder exists')

    let content = await fs.readFile(path.join(folder, 'src/index.html'), 'utf8')

    ok(content.includes(`<title>${title}</title>`), 'site title is updatd')

    let pkg = await fs.readJson(path.join(folder, 'package.json'))

    is(name, pkg.name, 'package name')

    content = await fs.readFile(path.join(folder, 'readme.md'), 'utf8')

    ok(content.includes(`# ${title}`), 'title in readme')
    ok(content.includes(description), 'description in readme')

  })

  test('plugin', async () => {

    const name = 'test-plugin'
    const title = 'My super plugin'
    const description = 'Description for plugin'

    await createProject({
      cwd: buildPath,
      project: {
        type: 'plugin',
        name,
        title,
        description,
        overwrite: true,
      },
    })
    ok(true, 'create plugin')

    const folder = path.join(buildPath, name)
    ok(await fs.exists(folder), 'project folder exists')

    let pkg = await fs.readJson(path.join(folder, 'package.json'))

    is(name, pkg.name, 'package name')

    let content = await fs.readFile(path.join(folder, 'readme.md'), 'utf8')

    ok(content.includes(`# ${title}`), 'title in readme')
    ok(content.includes(description), 'description in readme')

  })

  test('theme', async () => {

    const name = 'test-theme'
    const title = 'Your next theme'
    const description = 'Description for theme'

    await createProject({
      cwd: buildPath,
      project: {
        type: 'theme',
        name,
        title,
        description,
        overwrite: true,
      },
    })
    ok(true, 'create theme')

    const folder = path.join(buildPath, name)
    ok(await fs.exists(folder), 'project folder exists')

    let pkg = await fs.readJson(path.join(folder, 'package.json'))

    is(name, pkg.name, 'package name')

    let content = await fs.readFile(path.join(folder, 'readme.md'), 'utf8')

    ok(content.includes(`# ${title}`), 'title in readme')
    ok(content.includes(description), 'description in readme')
  })

  test('site', async () => {

    const name = 'test-site'
    const title = 'Awesome site'
    const description = 'Description for site'

    await createProject({
      cwd: buildPath,
      project: {
        type: 'site-wp-now',
        name,
        title,
        description,
        overwrite: true,
      },
    })
    ok(true, 'create site')

    const folder = path.join(buildPath, name)
    ok(await fs.exists(folder), 'project folder exists')

    let pkg = await fs.readJson(path.join(folder, 'package.json'))

    is(name, pkg.name, 'package name')

    let content = await fs.readFile(path.join(folder, 'readme.md'), 'utf8')

    ok(content.includes(`# ${title}`), 'title in readme')
    ok(content.includes(description), 'description in readme')
  })

  run()

})().catch(console.error)
