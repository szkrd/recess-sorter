# recess-sorter

Sort css/scss/less properties according to twitter recess rules.

* uses the [gonzales](https://github.com/tonyganch/gonzales-pe) AST parser
* it is meant to help you learn and use the recess order
* it will NOT fix any other warnings, only the `property-sort-order` will be changed

## options

* -h / --help        - Help
* -o / --output DEST - Output directory (multiple input files) or output filename (single input file)
* -w / --overwrite   - Overwrite input with output (default is stdout)
* -r / --recursive   - Recurse into source directories (use it with -w, at your own risk)
* -d / --dry-run     - Do not overwrite, just explain

## examples

process one file
```sh
recess-sorter -o output.scss input.scss
```

overwrite input with output (dry run first)
```sh
recess-sorter -w -d input.scss
recess-sorter -w input.scss
```

process all css files
```sh
recess-sorter -w -d ./tests/**/*.css
```
