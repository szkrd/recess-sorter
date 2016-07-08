#!/usr/bin/env node
const fs = require('fs')
const argv = require('yargs').argv
const recessSorter = require('./src/recessSorter')
const validExtensions = ['css', 'scss']

const help = argv.h || argv.help || false
const output = argv.o || argv.output
const files = argv._ || []

// TODO nicer help, files vs dirs?
if (help) {
  console.log('-h --help = this help')
  console.log('-o --output = output directory or filename')
  console.log('\nthe rest of the params are filenames (no wildcards yet)')
  process.exit(0)
}

if (!files.length) {
  console.error('nothing to do')
  process.exit(1)
}

files.forEach(fileName => {
  fs.readFile(fileName, 'utf8', (err, contents) => {
    if (err) {
      console.error(`Could not read ${fileName}.`)
      return true
    }

    const extension = fileName.replace(/^.*\./, '')
    if (validExtensions.indexOf(extension) === -1) {
      console.warn(`Unknown extension .${extension}`)
      return true
    }
    const ast = recessSorter.sort(contents, extension)
    const result = ast.toString()
    if (!output) {
      console.log(result)
      return true
    }

    const target = files.length === 1 ? output : (output + '/' + fileName.replace(/^.*\//, ''))
    fs.writeFile(target, result, (err) => {
      if (err) {
        console.error(`Could not write ${output}.`)
      }
    }) // end writeFile
  }) // end readFile
}) // end forEach
