const chalk = require('chalk')
const commander = require('commander')
const fs = require('fs-extra')
const path = require('path')
const packageJson = require('../package.json')

const program = new commander.Command(packageJson.name)
                            .version(packageJson.version)
                            .option('new')
                            .arguments('<project-directory>')
                            .action((name) => {
                              projectName = name
                            })
                            .parse(process.argv)

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(`${chalk.cyan('jeem')} new ${chalk.green('<project-directory>')}`)
  console.log()
  console.log('For example')
  console.log(` ${chalk.cyan('jeem')} new ${chalk.green('my-jeem-app')}`)
  console.log()
  console.log(`Run ${chalk.cyan(`jeem --help`)} to see all options`)
  process.exit(1)
} 

createApp(projectName)

function createApp (name) {

  const root = path.resolve(name)
  const appName = path.basename(root)

  // fs.ensureDirSync()

  // const originalDirectory = process.cwd()

  console.log(`Creating a new Jeem app in ${chalk.green(root)}`)
  console.log()

  init(root, appName)
}

function init (appPath, appName) {

  let temPath
  if (program.rawArgs[program.rawArgs.length - 1] === '--demo') {
    temPath = '../template/demo'
  } else {
    temPath = '../template/init'
  }

  // 先拷贝模板再修改package.json
  const templatePath = path.join(__dirname, temPath)
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath)
  } else {
    console.error(`Could not locate supplied template: ${chalk.green(templatePath)}`)
    return
  }

  const appPackage = require(path.join(appPath, 'package.json'))

  appPackage.name = appName
  appPackage.version = '0.1.0'
  appPackage.private = true
  appPackage.dependencies = appPackage.dependencies || {}
  appPackage.devDependencies = appPackage.devDependencies || {}
  appPackage.scripts = appPackage.scripts || {}
  appPackage.babel = appPackage.babel || {}

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  )

  console.log(`${chalk.green('Success!')}`)
  console.log()
  console.log(`Then ${chalk.green(`cd ${appName}`)} && ${chalk.green(`yarn`)} && ${chalk.green(`yarn dev`)} to code your world!`)
  console.log()
}