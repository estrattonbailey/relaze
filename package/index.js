/* eslint-disable */
import React from 'react'
import { findDOMNode } from 'react-dom'
import srraf from 'srraf'

/**
 * Poor-mans object-assign
 */
const merge = (target, ...args) => args.reduce((target, arg) => {
  Object.keys(arg).forEach(k => { target[k] = arg[k] })
  return target
}, target)

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
      threshold: this.props.threshold || 0
    }

    this.state = {}
  }

  setSource (props = this.props) {
    let temp = {}

    /**
     * Prioritize srcset, retina, src
     */
    if (this.config.srcSetEnabled && props.srcSet) {
      temp = {
        srcSet: props.srcSet
      }
    } else {
      const dpr = (window.devicePixelRatio ||
        window.screen.deviceXDPI / window.screen.logicalXDPI)
      const retina = dpr > 1 && props.retina

      temp = {
        src: retina || props.src
      }
    }

    if (temp.src || temp.srcSet) {
      this.setState(temp)

      /**
       * Remove handler
       */
      if (this.scroller) {
        this.scroller.destroy()
        this.scroller = null
      }
    }
  }

  init () {
    /**
     * Clear previous image data
     */
    this.setState({ src: null, srcSet: null })

    /**
     * Remove old event handler, if exists
     */
    this.scroller && this.scroller.destroy()

    /**
     * Get new ref
     */
    this.ref = findDOMNode(this)

    /**
     * Bind a new scroll handler
     */
    this.scroller = srraf.use(({ currY }) => {
      if (inViewport(this.ref, this.config.threshold, currY)) {
        this.setSource()
      }
    }).update()
  }

  componentWillReceiveProps (newProps) {
    /**
     * If props have changed without unmounting
     */
    if (
      this.props.src !== newProps.src
      || this.props.srcSet !== newProps.srcSet 
      || this.props.retina !== newProps.retina
    ) {
      /**
       * Re-initiate scroll binding with new data
       */
      this.init()
    } else if (this.scroller) {
      this.scroller.update()
    }
  }

  componentDidMount () {
    if (!this.props.src) { console.warn('Relaze requires a src value.') }

    this.config.srcSetEnabled = 'srcset' in document.createElement('img')

    /**
     * Set up initial scroll binding
     */
    this.init()
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
    return React.cloneElement(this.props.children, merge({}, this.props.children.props || {}, this.state))
  }
}
