import React from 'react'
import { render } from 'react-dom'
import Layzr from 'react-layzr'

render(
  <div>
    <Layzr src="http://unsplash.it/2000/1333">
      <img/>
    </Layzr>
  </div>,
  document.getElementById('root')
)
