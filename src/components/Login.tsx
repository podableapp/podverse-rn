import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'reactn'
import isEmail from 'validator/lib/isEmail'
import { TextInput } from '.'
import { translate } from '../lib/i18n'
import { testProps } from '../lib/utility'
import { PV } from '../resources'

type Props = {
  bottomButtons: any
  isLoading: boolean
  onLoginPressed?: any
  style?: any
}

type State = {
  email: string
  password: string
  submitIsDisabled: boolean
}

const testIDPrefix = 'login'

export class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      submitIsDisabled: true
    }
  }

  checkIfSubmitIsDisabled = () => {
    const submitIsDisabled = !isEmail(this.state.email) || !this.state.password
    this.setState({ submitIsDisabled })
  }

  login = () => {
    this.props.onLoginPressed({
      email: this.state.email,
      password: this.state.password
    })
  }

  emailChanged = (email: string) => {
    this.setState({ email }, () => {
      this.checkIfSubmitIsDisabled()
    })
  }

  passwordChanged = (password: string) => {
    this.setState({ password }, () => {
      this.checkIfSubmitIsDisabled()
    })
  }

  render() {
    const { bottomButtons, isLoading } = this.props
    const { email, password, submitIsDisabled } = this.state
    const { fontScaleMode } = this.global
    const disabledStyle = submitIsDisabled ? { backgroundColor: PV.Colors.gray } : null
    const disabledTextStyle = submitIsDisabled ? { color: PV.Colors.white } : null

    const signInButtonTextStyle =
      PV.Fonts.fontScale.largest === fontScaleMode
        ? [styles.signInButtonText, disabledTextStyle, { fontSize: PV.Fonts.largeSizes.md }]
        : [styles.signInButtonText, disabledTextStyle]

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <TextInput
          autoCapitalize='none'
          autoCompleteType='email'
          fontSizeLargestScale={PV.Fonts.largeSizes.md}
          keyboardType='email-address'
          onChangeText={this.emailChanged}
          onSubmitEditing={() => {
            this.secondTextInput.focus()
          }}
          placeholder={translate('Email')}
          placeholderTextColor={PV.Colors.gray}
          returnKeyType='next'
          style={styles.textField}
          testID={`${testIDPrefix}_email`}
          value={email}
        />
        <TextInput
          autoCapitalize='none'
          autoCompleteType='password'
          fontSizeLargestScale={PV.Fonts.largeSizes.md}
          onChangeText={this.passwordChanged}
          placeholder={translate('Password')}
          placeholderTextColor={PV.Colors.gray}
          inputRef={(input) => {
            this.secondTextInput = input
          }}
          returnKeyType='done'
          secureTextEntry={true}
          style={styles.textField}
          testID={`${testIDPrefix}_password`}
          value={password}
          underlineColorAndroid='transparent'
        />
        <TouchableOpacity activeOpacity={1}>
          <>
            <TouchableOpacity
              style={[styles.signInButton, disabledStyle]}
              disabled={submitIsDisabled || isLoading}
              onPress={this.login}
              {...testProps(`${testIDPrefix}_submit`)}>
              {isLoading ? (
                <ActivityIndicator animating={true} color={PV.Colors.gray} size='small' />
              ) : (
                <Text style={signInButtonTextStyle}>{translate('Login')}</Text>
              )}
            </TouchableOpacity>
            {bottomButtons}
          </>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  signInButton: {
    alignItems: 'center',
    backgroundColor: PV.Colors.white,
    marginBottom: 16,
    padding: 16
  },
  signInButtonText: {
    color: PV.Colors.brandColor,
    fontSize: PV.Fonts.sizes.md,
    fontWeight: 'bold'
  },
  textField: {
    backgroundColor: PV.Colors.white,
    color: PV.Colors.black,
    fontSize: PV.Fonts.sizes.lg,
    height: 50,
    marginBottom: 30,
    paddingHorizontal: 8
  },
  scrollView: {
    width: '100%'
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    maxWidth: deviceWidth
  }
})
