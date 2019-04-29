# juristek-parser

Parser de XML do BIPBOP Juristek para NodeJS.

## Installation

This is a [Node.js](https://nodejs.org/) module available through the 
[npm registry](https://www.npmjs.com/). It can be installed using the 
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or 
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install juristek-parser --save
```

# TL-DR

```js
const { Parser, Processos } = require('juristek-parser');
console.log(Parser.openString(xml, Processos).processos);
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [change-case](http://ghub.io/change-case): Convert a string between camelCase, PascalCase, Title Case, snake_case and more.
- [cheerio](http://ghub.io/cheerio): Tiny, fast, and elegant implementation of core jQuery designed specifically for the server
- [es6-error](http://ghub.io/es6-error): Easily-extendable error for use with ES6 classes
- [iso-7064](http://ghub.io/iso-7064): Implementation of ISO 7064 used in validation of format like IBAN, LEI, ...
- [moment](http://ghub.io/moment): Parse, validate, manipulate, and display dates
- [numeral](http://ghub.io/numeral): Format and manipulate numbers.
- [pad](http://ghub.io/pad): Left and right string padding
- [underscore](http://ghub.io/underscore): JavaScript&#39;s functional programming helper library.

## Dev Dependencies

- [babel-eslint](http://ghub.io/babel-eslint): Custom parser for ESLint
- [eslint](http://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-airbnb-base](http://ghub.io/eslint-config-airbnb-base): Airbnb&#39;s base JS ESLint config, following our styleguide
- [eslint-plugin-flowtype](http://ghub.io/eslint-plugin-flowtype): Flowtype linting rules for ESLint.
- [eslint-plugin-import](http://ghub.io/eslint-plugin-import): Import with sanity.

## License

ISC
