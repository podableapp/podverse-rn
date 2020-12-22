import React from 'react'
import { Text } from 'react-native'
import { useGlobal } from 'reactn'
import { testProps } from '../lib/utility'
import { PV } from '../resources'

type Props = {
  children?: any
  fontSizeLargerScale?: number
  fontSizeLargestScale?: number
  isSecondary?: any
  numberOfLines?: number
  onPress?: any
  style?: any
  testID: string
}

export const PVText = (props: Props) => {
  const { fontSizeLargerScale, fontSizeLargestScale, isSecondary, testID } = props
  const [globalTheme] = useGlobal('globalTheme')
  const [fontScaleMode] = useGlobal('fontScaleMode')
  const [censorNSFWText] = useGlobal('censorNSFWText')

  const globalThemeText = isSecondary ? globalTheme.textSecondary : globalTheme.text

  const textStyle = [globalThemeText, props.style]
  if (fontScaleMode === PV.Fonts.fontScale.larger) {
    textStyle.push({ fontSize: fontSizeLargerScale })
  } else if (fontScaleMode === PV.Fonts.fontScale.largest) {
    textStyle.push({ fontSize: fontSizeLargestScale })
  }

  return (
    <Text {...props} style={textStyle} {...(testID ? testProps(testID) : {})}>
      {typeof props.children === 'string' ? props.children?.sanitize(censorNSFWText) : props.children}
    </Text>
  )
}
