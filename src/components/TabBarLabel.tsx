import React from 'react'
import { Text } from 'react-native'
import { tabbar } from '../styles'

type Props = {
  title?: string
  focused?: boolean
}

export const TabBarLabel = (props: Props) => {
  const { title, focused } = props

  return (
    <Text allowFontScaling={false} numberOfLines={1} style={focused ? tabbar.labelDark : tabbar.labelLight}>
      {title}
    </Text>
  )
}
