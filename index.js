import React from 'react'
import { findDOMNode } from 'react-dom'
import srraf from 'srraf'

function pick (src, pick) {
  let keys = Object.keys(src)

  let picked = {}
  let rest = {}

  for (let i = 0; i < keys.length; i++) {
    if (pick.indexOf(keys[i]) > -1) {
      picked[keys[i]] = src[keys[i]]
    } else {
      rest[keys[i]] = src[keys[i]]
    }
  }

  return {
    picked,
    rest
  }
}

/**
 * @param {HTMLElement} node
 * @param {number} threshold Pixels outside viewport to fire
 * @param {number} y Current page scroll position
 */
function inViewport (node, threshold, y) {
  const nodeTop = node.getBoundingClientRect().top + y
  const nodeBot = nodeTop + node.offsetHeight
  const offset = threshold * window.innerHeight
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

      this.setConfig()

      this.state = {}
    }

    setSource () {
      const { src, srcSet, srcSetEnabled } = this.options

      const props = { src }

      if (srcSetEnabled && srcSet) {
        props.srcSet = srcSet
      }

      if (src || srcSet) {
        this.setState(props)
      }
    }

    setConfig () {
      const { picked, rest } = pick(
        Object.assign({}, this.props, {
          threshold: this.props.threshold || 0
        }),
        [ 'threshold', 'src', 'srcSet' ]
      )

      this.options = picked
      this.rest = rest
    }

    update (y = window.pageYOffset) {
      const visible = inViewport(findDOMNode(this), this.options.threshold, y)

      visible && this.setSource()

      return visible
    }

    cleanup () {
      this.scroller && this.scroller.destroy()
    }

    componentDidMount () {
      this.options.srcSetEnabled = 'srcset' in document.createElement('img')

      if (!this.update()) {
        this.scroller = srraf(({ y }) => {
          if (this.update(y)) this.cleanup()
        }).update()
      }
    }

    componentDidUpdate (props) {
      const { src, srcSet } = this.options

      /**
       * If props have changed without unmounting,
       * re-initiate scroll binding with new data
       */
      if (src !== props.src || srcSet !== props.srcSet) {
        this.setConfig()
      }
    }

    componentWillUnmount () {
      this.cleanup()
    }

    render () {
      return <Component {...this.rest} {...this.state} />
    }
  }
}
