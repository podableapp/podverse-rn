import React from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import { useGlobal } from 'reactn'
import { testProps } from '../lib/utility'
import { PV } from '../resources'
import { core } from '../styles'
import { Text, TextInput } from './'

type Props = {
  inputAutoCorrect?: boolean
  inputEditable?: boolean
  inputHandleBlur?: any
  inputHandleSubmit?: any
  inputHandleTextChange?: any
  inputPlaceholder?: string
  inputShow?: boolean
  inputText?: string
  onValueChange: any
  subText?: string
  testID?: string
  text: string
  value: boolean
}

export const SwitchWithText = (props: Props) => {
  const {
    inputAutoCorrect,
    inputEditable,
    inputHandleBlur,
    inputHandleSubmit,
    inputHandleTextChange,
    inputPlaceholder,
    inputShow,
    inputText,
    onValueChange,
    subText,
    testID,
    text,
    value
  } = props
  const [globalTheme] = useGlobal('globalTheme')

  return (
    <View>
      <View style={styles.switchWrapper}>
        <Switch onValueChange={onValueChange} value={value} {...(testID ? testProps(`${testID}_switch`) : {})} />
        <Text
          fontSizeLargestScale={PV.Fonts.largeSizes.md}
          style={styles.text}
          {...(testID ? testProps(`${testID}_text`) : {})}>
          {text}
        </Text>
      </View>
      {inputShow && (
        <TextInput
          autoCapitalize='none'
          autoCorrect={inputAutoCorrect}
          editable={!!inputEditable}
          fontSizeLargestScale={PV.Fonts.largeSizes.md}
          numberOfLines={1}
          onBlur={inputHandleBlur}
          onChangeText={inputHandleTextChange}
          onSubmitEditing={inputHandleSubmit}
          placeholder={inputPlaceholder}
          returnKeyType='done'
          style={[globalTheme.textInput, styles.textInput]}
          {...(testID ? testProps(`${testID}_text_input`) : {})}
          underlineColorAndroid='transparent'
          value={inputText}
        />
      )}
      {subText && (
        <Text
          fontSizeLargestScale={PV.Fonts.largeSizes.sm}
          style={[core.textInputSubTitle, globalTheme.textSecondary, styles.subText]}
          {...(testID ? testProps(`${testID}_sub_text`) : {})}>
          {subText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  subText: {
    marginTop: 8
  },
  switchWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 12
  },
  text: {
    flex: 1,
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    marginHorizontal: 12
  },
  textInput: {
    fontSize: PV.Fonts.sizes.xl,
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 4,
    minHeight: 44
  }
})
