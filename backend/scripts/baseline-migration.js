const { spawnSync } = require('node:child_process')

const migrationName = '0_init'

function runPrisma(args) {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'

  return spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe'
  })
}

function isAlreadyApplied(result) {
  const output = `${result.stdout || ''}\n${result.stderr || ''}`

  return /P3008|already recorded as applied|already applied/i.test(output)
}

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL is not set, skipping Prisma baseline migration.')
  process.exit(0)
}

const result = runPrisma([
  'prisma',
  'migrate',
  'resolve',
  '--applied',
  migrationName,
  '--schema',
  'prisma/schema.prisma'
])

if (result.status === 0 || isAlreadyApplied(result)) {
  process.exit(0)
}

process.stderr.write(result.stderr || result.stdout || 'Failed to baseline Prisma migration.\n')
process.exit(result.status || 1)
