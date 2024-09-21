import fs from 'fs/promises'
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
    await createProject({
      cwd: buildPath,
      project: {
        type: 'static',
        name: 'static',
        title: 'Static HTML site',
        overwrite: true,
      },
    })
    ok(true, 'create static site')
  })

  test('plugin', async () => {
    await createProject({
      cwd: buildPath,
      project: {
        type: 'plugin',
        name: 'example-plugin',
        title: 'Example Plugin',
        overwrite: true,
      },
    })
    ok(true, 'create plugin')
  })

  test('theme', async () => {
    await createProject({
      cwd: buildPath,
      project: {
        type: 'theme',
        name: 'example-theme',
        title: 'Example Theme',
        overwrite: true,
      },
    })
    ok(true, 'create theme')
  })

  test('site', async () => {
    await createProject({
      cwd: buildPath,
      project: {
        type: 'site',
        name: 'example-site',
        title: 'Example Site',
        overwrite: true,
      },
    })
    ok(true, 'create site')
  })

  run()

})().catch(console.error)
