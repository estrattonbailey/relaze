# relaze
1kb image lazy loading library for React.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features
1. Uses [srraf](https://github.com/estrattonbailey/srraf) for performant scrolling using `requestAnimationFrame`
2. Supports `srcset` and hi-dpi displays, in addition to default `src`
3. Extremely flexible API leaves implementation up to the developer
4. Supports server environments and SSR
5. Sooper small 😎

Inspired by [layzr.js](https://github.com/callmecavs/layzr.js).

## Usage
Out of the box, simply wrap an `img` tag with `Lazy` HoC and pass in a `src` image.
```javascript
import Lazy from 'relaze'

export const ImageStandard = ({ src }) => (
  <figure className="image">
    <Lazy src={src}>
      <img className="absolute fit-x fill-h fill-v"/>
    </Lazy>
  </figure>
)
```
When the image enters the viewport, Relaze passes the appropriate image properties to it's child.

Relaze doesn't use a wrapping element internally, so only the children of `Lazy` are rendered. The implicit API means that you can do whatever you want with the props passed to the `children` element of `Lazy`.

For example, it's easy to abstract your image component to fade in on image load:
```javascript
import Lazy from 'relaze'

class Img extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
    }
  }

  show() {
    this.setState({
      loaded: true,
    })
  }

  render() {
    let cx = `image image--large`

    if (this.state.loaded) cx += ' is-loaded'

    return <img className={cx} {...this.props} onLoad={this.show.bind(this)}/>
  }
}

export const ImageStandard = props => (
  <figure className="image">
    <Lazy src={props.src} srcSet={props.srcSet}>
      <Img/>
    </Lazy>
  </figure>
)
```
Or, toss the `src` attribute into a background image:
```javascript
import Lazy from 'relaze'

const Img = props => {
  const bg = `background-image: url(${props.src})`
  return (
    <div style={bg}/>
  )
}

export const ImageStandard = ({ ...props }) => (
  <figure className="image">
    <Lazy {...props}>
      <Img/>
    </Lazy>
  </figure>
)
```

## API
Relaze accepts a few parameters, passed in as props on the `Lazy` HoC.

### src
Each instance requires a `src` prop.
```javascript
<Lazy src={imageSrc}>
  <img/>
</Lazy>
```

### srcSet
If `srcset` is supported by the browser and Relaze is passed a `srcSet` prop, Relaze will pass it down to the child element. It does not parse the `srcSet` prop for syntax.
```javascript
<Lazy src={'image.jpg'} srcSet={'image.jpg 600w, image-large.jpg 1200w'}>
  <img/>
</Lazy>
```
Will render:
```html
<img srcset="image.jpg 600w, image-large.jpg 1200w"/>
```

### retina
If you want to support hi-res displays explicitly without support for `srcset`, use `retina`. It will replace the value of `src` if a device's DPI is great than 1.
```javascript
<Lazy src={'image.jpg'} retina={'image-large.jpg'}>
  <img/>
</Lazy>
```
If `DPI > 1`, this will render:
```html
<img src="image-large.jpg"/>
```

### threshold
Threshold is the pixel value above or below the viewport that the image loads. Positive values make images load sooner, negative values make images load later.
```javascript
<Lazy src={imageSrc} threshold={100}>
  <img/>
</Lazy>
```

## Browser Support
TODO, but should work in all evergreen browsers and IE 10+.

## Prior Art
1. [react-lazy](https://github.com/merri/react-lazy) - SEO friendly universal (isomorphic) lazy loader component, by [@merri](https://github.com/merri/react-lazy).
2. [react-lazy-load](https://github.com/loktar00/react-lazy-load) - React component that renders children elements when they enter the viewport, by [@loktar00](https://github.com/loktar00)
3. [react-lazyload](https://github.com/jasonslyvia/react-lazyload) - Lazyload your Component, Image or anything matters the performance, by [@jasonslyvia](https://github.com/jasonslyvia/react-lazyload)

## Example
To run the example, clone this repo, then:
```bash
# move into example dir
cd relaze/example
# install deps
npm i
# compile JS
npm run js:build # or js:watch
# serve index.html and update with changes
live-server 
```

MIT License
