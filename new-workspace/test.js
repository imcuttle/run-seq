// import App from './index-mobx'
import App from './index'
import { JSDOM } from 'jsdom'
import * as ReactDOM from 'react-dom'
import * as React from 'react'

const window = new JSDOM().window

global.window = window
global.document = window.document
global.navigator = window.navigator

const div = document.createElement('div')
document.body.appendChild(div)

const ref = React.createRef()

ReactDOM.render(<App ref={ref} />, div)

console.log(div.innerHTML)
ref.current.update()
console.log(div.innerHTML)
