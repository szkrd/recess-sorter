#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const shell = require('shelljs')
const recessSorter = require('./../src/recessSorter')

// setup shelljs, get args
shell.config.silent = true
const argv = yargs
  .boolean('d').boolean('dry-run')
  .boolean('r').boolean('recursive')
  .boolean('w').boolean('overwrite').argv

// options
let help = argv.h || argv.help || false
const output = argv.o || argv.output
const dry = argv.d || argv['dry-run']
const recursive = argv.r || argv.recursive
const overwrite = argv.w || argv.overwrite
const filesArg = argv._ || []
let files = filesArg
let exitCode = 0

if (process.argv.length === 2) {
  help = true
}

if (help) {
  console.log('Usage: recess-sorter [options...] <file...>')
  console.log('Options:')
  console.log('-h, --help          This help text')
  console.log('-o, --output DEST   Output directory (multiple input files) or output filename (single input file)')
  console.log('-w, --overwrite     Overwrite input with output (default is stdout)')
  console.log('-r, --recursive     Recurse into source directories (use it with -w, at your own risk)')
  console.log('-d, --dry-run       Do not overwrite, just explain')
  process.exit(0)
}

if (recursive && !files.length) {
  console.error('Did you really want to parse the current directory recursively?')
  process.exit(1)
}

// real magic: get all files from all directories (relative path, uniq, wildcards, sync)
const ls = (f) => Array.from(recursive ? shell.ls('-R', f) : shell.ls(f))
files = files.reduce((acc, prefix) => {
  let isDir
  try {
    isDir = fs.lstatSync(prefix).isDirectory()
  } catch (err) {
    process.exitCode
    console.error(`No such file or directory: "${prefix}"`)
    return acc
  }
  acc.push(...ls(prefix).filter(fn => /\.(s?css|less)/.test(fn)).map(fn => isDir ? prefix + '/' + fn : fn))
  return acc
}, [])
files = [...new Set(files)]

if (!files.length) {
  console.log('Nothing to do.')
  process.exit(0)
}

files.forEach(fileName => {
  fs.readFile(path.normalize(fileName), 'utf8', (err, contents) => {
    if (err) {
      exitCode = 1
      console.error(`Could not read "${fileName}".`)
      return true
    }

    const extension = fileName.replace(/^.*\./, '')
    const ast = recessSorter.sort(contents, extension)
    const result = ast.toString()
    if (!output && !overwrite) {
      console.log(result)
      return true
    }

    let target = path.normalize(files.length === 1 ? output : (output + '/' + fileName.replace(/^.*\//, '')))
    if (overwrite) {
      target = fileName
    }
    if (dry) {
      console.error(`Did not write "${target}".`)
      return true
    }

    fs.writeFile(target, result, (err) => {
      if (err) {
        exitCode = 1
        console.error(`Could not write "${target}".`)
      }
    }) // end writeFile
  }) // end readFile
}) // end forEach

process.exitCode = exitCode
