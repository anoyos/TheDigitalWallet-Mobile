import React from 'react'
import Svg, { Path } from 'react-native-svg'

const XIcon = props => (
  <Svg width={ 18 } height={ 18 } { ...props }>
    <Path
      d="M9 9l8-8-8 8-8-8 8 8zm0 0l8 8-8-8-8 8 8-8z"
      stroke="#000"
      strokeWidth={ 1.8 }
      fill="none"
      fillRule="evenodd"
      opacity={ 0.6 }
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default XIcon
