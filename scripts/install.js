'use strict'

const fs = require('fs')
const { resolve } = require('path')
const { join } = require('path')
const cp = require('child_process')

// get library path
const lib = resolve(__dirname, '../code/')

fs.readdirSync(lib)
  .forEach(function (mod) {
    const modPath = join(lib, mod)
    
    // ensure path has package.json
    if (!fs.existsSync(join(modPath, 'package.json'))) return false

    // Determine OS and set command accordingly
    const cmd = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

    // install folder
    cp.spawn(cmd, ['i'], { env: process.env, cwd: modPath, stdio: 'inherit' })
  })