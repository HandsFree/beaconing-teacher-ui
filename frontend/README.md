# Project Boilerplate

Boilerplate code for new frontend projects

## Setup

```
$ yarn
$ yarn b
```

## Changes for new project
- .gitignore: change output bundle location
- package.json:
    - change project name
    - change desc
    - change paths in clean script
- tsconfig.json: change out dir
- webpack.config.js:
    - change entry point names
    - change output path name
    - change public path name
    - change devServer path
    - change banner messages
    - change OfflinePlugin externals if needed
- now.json: name of url
