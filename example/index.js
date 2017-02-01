import React from 'react'
import { render } from 'react-dom'
import Lazy from 'relaze'

render(
  <div>
    <Lazy src="http://unsplash.it/2000/1333" srcSet="http://unsplash.it/3000/1333">
      <img/>
    </Lazy>
  </div>,
  document.getElementById('root')
)
