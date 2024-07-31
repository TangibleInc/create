import { confirm, input, select } from '@inquirer/prompts' // https://github.com/SBoudrias/Inquirer.js/

export async function prompt(questions, data = {}) {
  for (const question of questions) {
    const {
      type = 'input',
      name,
      message,
      when,
      validate,
      filter,
      choices = [],
      required = false,
      before,
      after,
    } = question
    if (when && !(await when(data))) continue

    const defaultValue =
      typeof question.default === 'boolean' ||
      typeof question.default === 'string'
        ? question.default
        : question.default instanceof Function
          ? await question.default(data)
          : ''

    let answer

    if (before) await before(data)

    try {
      switch (type) {
        case 'confirm':
          answer = await confirm({
            message,
            default: defaultValue,
          })
          break
        case 'select':
          answer = await select({
            message,
            choices,
            default: defaultValue,
          })
          break
        case 'input':
          answer = await input({
            message,
            validate,
            default: defaultValue,
            required,
          })
          break
        default:
          console.log('Unknown question type:', type)
          break
      }
    } catch (e) {
      // CTRL+C throws - Exit quietly
      if (e.name !== 'ExitPromptError') {
        console.error(e)
      }
      process.exit(1)
    }
    if (filter) answer = await filter(answer)
    data[name] = answer

    if (after) await after(data)
  }

  return data
}
