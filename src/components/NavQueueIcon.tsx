import React from 'react'
import { GlobalTheme } from '../../src/resources/Interfaces'
import { darkTheme } from '../../src/styles'
import { PV } from '../resources'
import { NavItemIcon, NavItemWrapper } from './'

type Props = {
  globalTheme: GlobalTheme
  isTransparent?: boolean
  navigation: any
  showBackButton?: boolean
}

export const NavQueueIcon = (props: Props) => {
  const { isTransparent, navigation, showBackButton } = props

  const handlePress = () => {
    navigation.navigate({
      routeName: PV.RouteNames.QueueScreen,
      params: {
        isTransparent,
        showBackButton
      }
    })
  }

  let color = darkTheme.text.color
  if (props.globalTheme) {
    color = props.globalTheme?.text?.color
  }

  return (
    <NavItemWrapper handlePress={handlePress} testID='nav_queue_icon'>
      <NavItemIcon name='list' color={color} />
      {/*<Image
        source={PV.Images.QUEUE}
        style={[navHeader.buttonIcon, { tintColor: '#fff', width: PV.Icons.NAV, height: PV.Icons.NAV }]}
      />*/}
    </NavItemWrapper>
  )
}
