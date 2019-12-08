const runSeq = require('..').default
const React = require('react')
const shallowEqual = require('shallowequal')
const { Map, fromJS, List } = require('immutable')
const { mount } = require('enzyme')
const { transformers, tree, transformReactElement } = require('./helper')

class ReactDeep extends React.Component {
  static defaultProps = {
    transformers: []
  }

  get transformers() {
    return [
      ...this.props.transformers,
      (node, ctx, next) => {
        return ''
      }
    ]
  }

  render() {
    console.log('root render')
    return transformReactElement(fromJS(this.props.state), this.transformers)
  }
}

describe('react-deep-bad', function() {
  it('should spec works `next.all` well', function() {
    const state = fromJS(tree)

    const elem = React.createElement(ReactDeep, {
      state: state,
      transformers
    })

    const wrapper = mount(elem)
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><span>lalalala</span><p><img src=\\"./img.png\\"><span>lalalala</span></p></p>"`
    )

    const newState = state.updateIn(['nodes', 2, 'nodes', 0], img => img.setIn(['data', 'src'], './updated.png'))
    wrapper.setProps({
      state: newState
    })
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><span>lalalala</span><p><img src=\\"./updated.png\\"><span>lalalala</span></p></p>"`
    )
  })
})
