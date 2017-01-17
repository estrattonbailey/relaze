# react-layzr
**WIP**

## Usage
Basic, no fade in, normal `img` tag:
```javascript
import React from 'react'
import Layzr from 'react-layzr'

export const ImageStandard = ({ ...props }) => (
  <figure className="image image--standard mx0 relative bg-gray2">
    <Layzr {...props}>
      <img className="absolute fit-x fill-h fill-v"/>
    </Layzr>
  </figure>
)
```
Wait for load event, add class to fade in:
```javascript
import React from 'react'
import Layzr from 'react-layzr'

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
    let cx = `absolute fit-x fill-h fill-v`

    if (this.state.loaded) cx += ' is-loaded'

    return <img className={cx} {...this.props} onLoad={this.show.bind(this)}/>
  }
}

export const ImageStandard = ({ ...props }) => (
  <figure className="image image--standard mx0 relative bg-gray2">
    <Layzr {...props}>
      <Img/>
    </Layzr>
  </figure>
)
```
Usage for background images:
```javascript
import React from 'react'
import Layzr from 'react-layzr'

const Img = props => {
  // bg image, only needs src
  let bg = `background-image: url(${props.src})`
  return (
    <div style={bg}/>
  )
}

export const ImageStandard = ({ ...props }) => (
  <figure className="image image--standard mx0 relative bg-gray2">
    <Layzr {...props}>
      <Img/>
    </Layzr>
  </figure>
)
```
