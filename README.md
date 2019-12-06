# run-seq

[![Build status](https://img.shields.io/travis/imcuttle/run-seq/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/run-seq)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/run-seq.svg?style=flat-square)](https://codecov.io/github/imcuttle/run-seq?branch=master)
[![NPM version](https://img.shields.io/npm/v/run-seq.svg?style=flat-square)](https://www.npmjs.com/package/run-seq)
[![NPM Downloads](https://img.shields.io/npm/dm/run-seq.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/run-seq)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> run a series of tasks with next controller
>
> It's useful for splitting multiple related tasks.

## Installation

```bash
npm install run-seq
# or use yarn
yarn add run-seq
```

## Usage

```javascript
import runSeq from 'run-seq'
const tree = {
  tagName: 'p',
  nodes: [
    {
      tagName: 'img',
      data: {
        src: './img.png'
      }
    },
    {
      tagName: 'text',
      text: 'lalalala'
    },
    {
      tagName: 'p',
      nodes: [
        {
          tagName: 'img',
          data: {
            src: './img.png'
          }
        },
        {
          tagName: 'text',
          text: 'lalalala'
        }
      ]
    }
  ]
}

const html = runSeq(
  [
    // 0
    (node, next) => {
      if (!node) return ''
      if (!Array.isArray(node)) {
        node = [node]
      }

      return node.map(node => next(node)).join('\n')
    },
    // 1
    (node, next) => {
      switch (node.tagName) {
        case 'img':
          return `<img src="${node.data.src}"/>`
        case 'p':
          // `next.all` is processing the all sequence (0-3)
          return `<p>${next.all(node.nodes)}</p>`
      }
      // `next` is processing the next task (2)
      return next(node)
    },
    // 2
    (node, next) => {
      switch (node.tagName) {
        case 'text':
          return node.text
      }
      return next(node)
    },
    // 3
    node => ''
  ],
  [tree]
)

html // => <p><img src="./img.png"><span>lalalala</span><p><img src="./img.png"><span>lalalala</span></p></p>
```

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
