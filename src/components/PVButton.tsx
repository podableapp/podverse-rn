import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { useGlobal } from 'reactn'
import { Text } from '.'
import { testProps } from '../lib/utility'
import { PV } from '../resources'
import { core } from '../styles'

type Props = {
  disabled?: boolean
  isLoading?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  onPress: any
  testID?: string
  text: string
  wrapperStyles: any
}

export const PVButton = (props: Props) => {
  const { disabled, isLoading, isSuccess, isWarning, onPress, testID, text, wrapperStyles } = props
  const [globalTheme] = useGlobal('globalTheme')

  const disabledStyle = disabled ? globalTheme.buttonDisabledWrapper : null
  const disabledTextStyle = disabled ? globalTheme.buttonDisabledText : null
  const isSuccessStyle = isSuccess ? globalTheme.buttonSuccessWrapper : null
  const isSuccessTextStyle = isSuccess ? globalTheme.buttonSuccessText : null
  const isWarningStyle = isWarning ? globalTheme.buttonWarningWrapper : null
  const isWarningTextStyle = isWarning ? globalTheme.buttonWarningText : null

  return (
    <TouchableOpacity
      style={[
        core.button,
        globalTheme.buttonPrimaryWrapper,
        disabledStyle,
        isSuccessStyle,
        isWarningStyle,
        wrapperStyles
      ]}
      disabled={disabled || isLoading}
      onPress={onPress}
      {...(testID ? testProps(`${testID}_button`) : {})}>
      {isLoading ? (
        <ActivityIndicator animating={true} color={globalTheme.buttonPrimaryText.color} size='small' />
      ) : (
        <Text
          fontSizeLargestScale={PV.Fonts.largeSizes.md}
          style={[
            core.buttonText,
            globalTheme.buttonPrimaryText,
            disabledTextStyle,
            isSuccessTextStyle,
            isWarningTextStyle
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  )
}
