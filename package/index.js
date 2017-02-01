import React from 'react'
import { findDOMNode } from 'react-dom'
import srraf from 'srraf'

/**
 * @param {HTMLElement} node
 * @param {number} threshold Pixels outside viewport to fire
 * @param {number} y Current page scroll position
 */
function inViewport (node, threshold, y) {
  const windowHeight = window.innerHeight
  const viewTop = y
  const viewBot = viewTop + windowHeight

  const nodeTop = node.getBoundingClientRect().top + y
  const nodeBot = nodeTop + node.offsetHeight

  const offset = (threshold / 100) * windowHeight

  return (nodeBot >= viewTop - offset) && (nodeTop <= viewBot + offset)
}

/**
 * @param {number} threshold Pixels outside viewport to fire
 * @param {string} src Default image src
 * @param {string} [srcSet] valid HTML srcset value
 * @param {string} [retina] High DPI image (prefer srcSet)
 */
export default class Relaze extends React.Component {
  constructor (props) {
    super(props)

    /**
     * Store values sep from state
     */
    this.config = {
      src: this.props.src,
      threshold: this.props.threshold || 0,
      srcSet: this.props.srcSet || null,
      retina: this.props.retina || null
    }

    this.state = {}
  }

  setSource () {
    /**
     * Prioritize srcset, retina, src
     */
    if (this.config.srcSetEnabled && this.config.srcSet) {
      this.setState({
        srcSet: this.config.srcSet
      })
    } else {
      const retina = this.config.devicePixelRatio > 1 && this.config.retina
      this.setState({
        src: retina || this.config.src
      })
    }

    /**
     * Remove handler
     */
    if (this.scroller) {
      this.scroller.destroy()
    }
  }

  componentDidMount () {
    if (!this.props.src) { return console.warn('Relaze requires a src value.') }

    this.config.srcSetEnabled = 'srcset' in document.createElement('img')
    this.config.devicePixelRatio = (window.devicePixelRatio ||
      window.screen.deviceXDPI / window.screen.logicalXDPI)

    this.scroller = srraf.use(({ currY }) => {
      if (inViewport(findDOMNode(this), this.config.threshold, currY)) {
        this.setSource()
      }
    }).update()
  }

  componentWillUnmount () {
    /**
     * Make sure all handlers are removed
     * even if the image was never inViewport
     */
    if (this.scroller) {
      this.scroller.destroy()
    }
  }

  render () {
    return React.cloneElement(this.props.children, this.state)
  }
}
