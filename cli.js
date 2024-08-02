#!/usr/bin/env node

const args = process.argv.slice(2)
const defaultProjectName = args[0]

createProject(defaultProjectName).catch(console.error)
