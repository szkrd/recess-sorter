const assert = require('assert')
const path = require('path')
const shell = require('shelljs')
const sorter = require('../src/recessSorter')

const load = (fileName) => {
  return shell.cat(path.resolve(path.join(__dirname, '/before/', fileName))) + ''
}
const trim = (s) => {
  return s.trim().replace(/^\n/, '').replace(/\n+$/, '')
}
const resort = (fileName) => {
  return trim(sorter.sort(load(fileName)).toString())
}
const assertEqual = (fileName, expected) => {
  return assert.equal(resort(fileName), trim(expected), `${fileName} broke!`)
}


assertEqual('simple.scss', `
body {
    width: 800px;
    height: 600px;
    border: 1px solid red;
}
`)

assertEqual('nested.scss', `
$font-stack: Helvetica, sans-serif;
$primary-color: #333;
$secondary-color: #eeffee;

body {
    font: 100% $font-stack;
    color: $primary-color;

    p {
        position: absolute;
        color: $secondary-color;
    }
}
`)

// linear style
assert.equal(trim(sorter.sort(`
body { opacity: 0.5; white-space: nowrap; }
`).toString()), trim(`
body { white-space: nowrap; opacity: 0.5; }
`))

// plain css
assert.equal(trim(sorter.sort(`
ol {
  margin: 0;
  padding: 0;
}
`, 'css').toString()), trim(`
ol {
  padding: 0;
  margin: 0;
}
`))

// css with keyframes
assert.equal(trim(sorter.sort(`
@keyframes example {
  0%   { border-color: lime; background-color: red; }
  25%  { border-color: fuchsia; background-color: yellow; }
  50%  { border-color: maroon; background-color: blue; }
  100% { border-color: salmon; background-color: green; }
}
div {
  animation-name: example;
  animation-duration: 4s;
  height: 100px;
  width: 100px;
  background-color: red;
}
`, 'css').toString()), trim(`
@keyframes example {
  0%   { background-color: red; border-color: lime; }
  25%  { background-color: yellow; border-color: fuchsia; }
  50%  { background-color: blue; border-color: maroon; }
  100% { background-color: green; border-color: salmon; }
}
div {
  width: 100px;
  height: 100px;
  background-color: red;
  animation-duration: 4s;
  animation-name: example;
}
`))
