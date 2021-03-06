const runSeq = require('..').default
const React = require('react')
const shallowEqual = require('shallowequal')
const { Map, fromJS, List } = require('immutable')
const { mount } = require('enzyme')
const { transformReactElement, tree, transformers } = require('./helper')

class Node extends React.Component {
  shouldComponentUpdate(newProps, newState) {
    return !this.props.node.equals(newProps.node)
  }
  render() {
    console.log(this.props.node.toJS())
    return this.props.render() || null
  }
}

class ReactDeep extends React.Component {
  static defaultProps = {
    transformers: []
  }

  get transformers() {
    return [
      (node, ctx, next) => {
        return <Node node={node} render={() => next()} />
      },
      ...this.props.transformers,
      (node, next) => {
        return ''
      }
    ]
  }

  render() {
    console.log('root render')
    return transformReactElement(fromJS(this.props.state), this.transformers)
  }
}

describe('react-deep', function() {
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
