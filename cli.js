#!/usr/bin/env node
import { createProject } from './index.js'

const args = process.argv.slice(2)
const defaultProjectName = args[0]

createProject(defaultProjectName).catch(console.error)
