/* eslint-disable */
const { generateTemplateFiles } = require('generate-template-files');
generateTemplateFiles([
  {
    option: 'Create Service Files',
    defaultCase: '(kebabCase)',
    entry: {
      folderPath: './tools/templates/__service__',
    },
    stringReplacers: ['__service__'],
    output: {
      path: './src/services/__service__(kebabCase)',
      pathAndFileNameDefaultCase: '(kebabCase)',
    },
    onComplete: (results) => {
      console.log(`results`, results);
    },
  },
  {
    option: 'Create Service Component',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/__component__',
    },
    stringReplacers: ['__component__'],
    output: {
      path: './src/components/__component__(pascalCase)',
      pathAndFileNameDefaultCase: '(pascalCase)',
    },
    onComplete: (results) => {
      console.log(`results`, results);
    },
  },
]);
