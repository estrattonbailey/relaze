import React from 'react'
import { findDOMNode } from 'react-dom'
import srraf from 'srraf'

/**
 * @param {HTMLElement} node
 * @param {number} threshold Pixels outside viewport to fire
 * @param {number} y Current page scroll position
 */
function inViewport (node, threshold, y) {
  const nodeTop = node.getBoundingClientRect().top + y
  const nodeBot = nodeTop + node.offsetHeight
  const offset = (threshold / 100) * window.innerHeight
  return (nodeBot >= y - offset) && (nodeTop <= (y + window.innerHeight) + offset)
}

/**
 * @param {number} threshold Pixels outside viewport to fire
 * @param {string} src Default image src
 * @param {string} [srcSet] valid HTML srcset value
 */
export default function lazy (Component) {
  return class Relaze extends React.Component {
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

    setSource () {
      const { srcSetEnabled } = this.config
      const { src, srcSet } = this.props

      const props = { src }

      if (srcSetEnabled && srcSet) {
        props.srcSet = srcSet
      }

      if (src || srcSet) {
        this.setState(props)
      }

      this.cleanup()
    }

    init () {
      /**
       * Clear previous image data
       */
      this.setState({ src: null, srcSet: null })


      /**
       * Get new ref
       */
      this.ref = findDOMNode(this)

      /**
       * Bind a new scroll handler
       */
      this.scroller = srraf(({ y }) => {
        if (inViewport(this.ref, this.config.threshold, y)) {
          this.setSource()
        }
      }).update()
    }

    cleanup () {
      this.scroller && this.scroller.destroy()
    }

    componentWillReceiveProps (props) {
      const { src, srcSet } = this.props

      /**
       * If props have changed without unmounting,
       * re-initiate scroll binding with new data
       */
      if (src !== props.src || srcSet !== props.srcSet) {
        this.init()
      } else if (this.scroller) {
        this.scroller.update()
      }
    }

    componentDidMount () {
      this.config.srcSetEnabled = 'srcset' in document.createElement('img')
      this.init()
    }

    componentWillUnmount () {
      this.cleanup()
    }

    render () {
      return <Component {...this.props} {...this.state} />
    }
  }
}
