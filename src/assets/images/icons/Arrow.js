import React from 'react'
import Svg, { Path } from 'react-native-svg'

const Arrow = props => (
  <Svg width={ 16 } height={ 16 } { ...props }>
    <Path
      d="M9.928 1.904c-.922-2.005-2.42-2.01-3.35-.001L1.227 13.466C.3 15.47 1.16 16.305 3.142 15.334l5.091-2.493 5.159 2.584c1.976.99 2.828.161 1.91-1.837L9.927 1.904z"
      fill="#FFF"
      fillRule="evenodd"
    />
  </Svg>
)

export default Arrow
