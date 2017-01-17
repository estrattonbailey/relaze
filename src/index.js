import React from 'react'
import ReactDOM from 'react-dom'
import scroller from './scroll'

function inViewport (node, threshold, scrollY) {
  const windowHeight = window.innerHeight
  const viewTop = scrollY
  const viewBot = viewTop + windowHeight

  const nodeTop = node.getBoundingClientRect().top + scrollY
  const nodeBot = nodeTop + node.offsetHeight

  const offset = (threshold / 100) * windowHeight

  return (nodeBot >= viewTop - offset) && (nodeTop <= viewBot + offset)
}

export default class Layzr extends React.Component {
  constructor (props) {
    super(props)

    if (!this.props.src) { return console.warn('Layzr requires a src value.') }

    this.config = {
      src: this.props.src,
      threshold: this.props.threshold || 0
    }

    if (this.props.retina) { this.config.retina = this.props.retina }
    if (this.props.srcSet) { this.config.srcSet = this.props.srcSet }

    this.state = {}
  }

  setSource () {
    if (this.config.srcSetEnabled && this.config.srcSet) {
      this.setState({ srcSet: this.config.srcSet })
    } else {
      const retina = this.config.dpr > 1 && this.config.retina
      this.setState({ src: retina || this.config.src })
    }

    if (this.scroller) {
      this.scroller.destroy()
    }
  }

  componentDidMount () {
    this.config.node = ReactDOM.findDOMNode(this)
    this.config.srcSetEnabled = 'srcset' in document.createElement('img')
    this.config.dpr = (window.devicePixelRatio ||
      window.screen.deviceXDPI / window.screen.logicalXDPI)

    this.scroller = scroller.use((curr, prev) => {
      if (inViewport(this.config.node, this.config.threshold, curr)) {
        this.setSource()
      }
    })
  }

  componentWillUnmount () {
    if (this.scroller) {
      this.scroller.destroy()
    }
  }

  render () {
    return React.cloneElement(this.props.children, this.state)
  }
}

