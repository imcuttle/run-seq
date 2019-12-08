const waterFall = require('..').waterFall
const React = require('react')
const visitTree = require('@moyuyc/visit-tree')
const { mount } = require('enzyme')
const { transformReactElement, tree, transformers } = require('./helper')

describe('tree-seq', function() {
  it('should spec', function() {
    const elem = transformReactElement(tree, transformers)
    const wrapper = mount(elem)
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><span>lalalala</span><p><img src=\\"./img.png\\"><span>lalalala</span></p></p>"`
    )
  })
})
