/**
 * Thanks: https://github.com/vitebook/vitebook/tree/main/scripts
 */

import { exec } from 'child_process'
import { promisify } from 'util'

async function main() {
  const nodeV = await promisify(exec)('node -v')
  const nodeVersion = parseInt(nodeV.stdout.slice(1).split('.')[0])

  if (nodeVersion < 16) {
    console.warn(
      '\n',
      '⚠️ \u001B[33mThis package requires your Node.js version to be `>=16`'
      + ' to work properly.\u001B[39m',
      '\n\n1. Install Volta to automatically manage it by running: \x1B[1mcurl https://get.volta.sh | bash\x1B[0m',
      '\n2. Install Node.js by running: \x1B[1mvolta install node@16\x1B[0m',
      '\n3. Done! Run `npm` commands as usual and it\'ll just work :)',
      '\n\nSee \x1B[1mhttps://volta.sh\x1B[0m for more information.',
      '\n',
    )

    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
