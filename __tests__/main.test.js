const runSeq = require('..').default
const { noPassing } = require('..')

describe('run-seq', function() {
  it('should spec works well', function() {
    const tasks = [
      jest.fn((obj, next) => {
        obj.name = 'pig'
        return { ...obj }
      }),
      jest.fn(v => v)
    ]
    expect(runSeq(tasks, [{ name: 'imcuttle' }])).toMatchInlineSnapshot(`
            Object {
              "name": "pig",
            }
        `)

    expect(tasks[0]).toHaveBeenCalledTimes(1)
    expect(tasks[1]).not.toHaveBeenCalled()
  })

  it('should spec works `next` well', function() {
    const tasks = [
      jest.fn((obj, next) => {
        return next({
          newName: 'imcuttle'
        })
      }),
      jest.fn((v, next) => {
        return next(v)
      }),
      jest.fn((v, next) => {
        return v
      })
    ]
    expect(runSeq(tasks, [{ name: 'imcuttle' }])).toMatchInlineSnapshot(`
            Object {
              "newName": "imcuttle",
            }
        `)

    expect(tasks[0]).toHaveBeenCalledTimes(1)
    expect(tasks[1]).toHaveBeenCalledTimes(1)
  })

  it('should spec noPassing works `next` well', function() {
    const tasks = [
      jest.fn((obj, next) => {
        return next({
          newName: 'imcuttle'
        })
      }),
      jest.fn((v, next) => {
        return next()
      }),
      jest.fn((v, next) => {
        return v
      })
    ]
    expect(noPassing(tasks, [{ name: 'imcuttle' }])).toMatchInlineSnapshot(`
            Object {
              "name": "imcuttle",
            }
        `)

    expect(tasks[0]).toHaveBeenCalledTimes(1)
    expect(tasks[1]).toHaveBeenCalledTimes(1)
  })

  it('should spec works `next.all` well', function() {
    const tasks = [
      (node, next) => {
        if (!node) return ''
        if (!Array.isArray(node)) {
          node = [node]
        }

        return node.map(node => next(node)).join('\n')
      },
      (node, next) => {
        switch (node.tagName) {
          case 'img':
            return `<img src="${node.data.src}"/>`
          case 'p':
            return `<p>${next.all(node.nodes)}</p>`
        }
      },
      (node, next) => {
        switch (node.tagName) {
          case 'text':
            return node.text
        }
        return next.all(node)
      }
    ]
    expect(
      runSeq(tasks, [
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
      ])
    ).toMatchInlineSnapshot(`
            "<p><img src=\\"./img.png\\"/>

            <p><img src=\\"./img.png\\"/>
            </p></p>"
        `)
  })
})
