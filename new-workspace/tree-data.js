export default {
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
