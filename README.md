# relaze
Tiny image lazy loading library for React. **800 bytes gzipped**.

## Features
1. Single higher-order component
1. Performant scrolling using `requestAnimationFrame`
2. Supports `srcset`
4. Universal

## Install
```bash
npm i relaze --save
```

# Usage
Create a reusable image component:
```javascript
// Image.js
import relaze from 'relaze'

export default relaze(({ src, srcSet }) => (
  <img src={src} srcSet={srcSet} />
))
```
Pass it a `src` and a `srcSet` prop (optional):
```javascript
import Image from './Image.js'

<Image src='image.jpg' srcSet='image.jpg 600w, image-large.jpg 1200w' />
```
When the image enters the viewport, Relaze will pass the `src` and `srcSet`
props to its child component.

### Fade-in Image
```javascript
// Image.js
import relaze from 'relaze'
import cx from 'classnames'

class Image extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loaded: false }
  }

  render() {
    const { loaded } = this.state
    const { src, srcSet } = this.props

    return (
      <img
        src={src}
        srcSet={srcSet}
        className={cx({
          'is-loaded': loaded
        })}
        onLoad={e => {
          this.setState({
            loaded: true
          })
        }} />
    )
  }
}

export default relaze(Image)
```
### Background Image
```javascript
import relaze from 'relaze'

export default relaze(({ src }) => (
  <div style={{
    backgroundImage: `url(${src})`
  }} />
))
```
### Adjusting Threshold
A fraction of the viewport height. Positive values makes image load sooner, negative values makes image load later.
```javascript
import Image from './Image.js'

<Image src='image.jpg' threshold={0.2} />
```

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)
