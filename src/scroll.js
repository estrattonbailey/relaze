let instance = null

const init = () => {
  let inc = 0
  let queue = []
  let scrollY = returnPosition()
  let prevScrollY = returnPosition()
  let ticking = false

  function returnPosition () {
    return window.scrollY || window.pageYOffset
  }

  function requestFrame () {
    scrollY = returnPosition()

    if (!ticking) {
      window.requestAnimationFrame(run)
      ticking = true
    }
  }

  function run () {
    queue.forEach(q => q[1](scrollY, prevScrollY))
    prevScrollY = scrollY
    ticking = false
  }

  window.addEventListener('scroll', requestFrame)
  window.addEventListener('resize', requestFrame)

  return {
    use (cb) {
      let index = inc++

      queue.push([index, cb])

      run()

      return {
        destroy () {
          queue.forEach((q, i) => {
            if (q[0] === index) {
              queue.splice(i, 1)
            }
          })
        }
      }
    },
    update () {
      run()
    }
  }
}

const Scroller = {
  get instance () {
    if (!instance && typeof window !== 'undefined') {
      instance = init()
      return instance
    } else {
      return {}
    }
  }
}

export default Scroller.instance
