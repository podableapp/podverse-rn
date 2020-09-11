import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { translate } from '../lib/i18n'
import { PV } from '../resources'
import { gaTrackPageView } from '../services/googleAnalytics'

type Props = {
  loginUser: ({}) => Promise<any>
  navigation: any
}

type State = {}

export class OnboardingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  componentDidMount() {
    gaTrackPageView('/onboarding', 'Onboarding Screen')
  }

  dismissOnboarding = () => {
    this.props.navigation.navigate('MainApp')
  }

  goToLogin = async () => {
    this.props.navigation.navigate(PV.RouteNames.AuthScreen, {
      isOnboarding: true
    })
  }

  render() {
    const extraMargin = { marginTop: 40 }

    return (
      <SafeAreaView style={styles.view}>
        <Image source={PV.Images.BANNER} style={styles.banner} resizeMode='contain' />
        <View style={styles.content}>
          <Text style={styles.title}>{translate('No login needed to:')}</Text>
          <Text style={styles.text}>{translate('Listen to episodes and clips')}</Text>
          <Text style={styles.text}>{translate('Subscribe to podcasts')}</Text>
          <Text style={[styles.title, extraMargin]}>{translate('Login to')}</Text>
          <Text style={styles.text}>{translate('Create and share playlists')}</Text>
          <Text style={styles.text}>{translate('Edit clips and playlists')}</Text>
          <Text style={styles.text}>{translate('Sync podcasts across devices')}</Text>
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={this.goToLogin}>
          <Text style={styles.signInButtonText}>Login / Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipSignInButton} onPress={this.dismissOnboarding}>
          <Text style={styles.skipSignInText}>No Thanks</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    backgroundColor: PV.Colors.brandColor,
    flex: 1,
    justifyContent: 'center'
  },
  banner: {
    marginTop: 60,
    marginBottom: 20,
    width: '80%'
  },
  content: {
    flex: 1,
    width: '80%'
  },
  skipSignInButton: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    padding: 10,
    width: '80%'
  },
  skipSignInText: {
    color: PV.Colors.white,
    fontSize: PV.Fonts.sizes.sm
  },
  signInButton: {
    alignItems: 'center',
    borderColor: PV.Colors.gray,
    borderWidth: 1,
    marginBottom: 200,
    padding: 10,
    width: '80%'
  },
  signInButtonText: {
    color: PV.Colors.white,
    fontSize: PV.Fonts.sizes.md,
    fontWeight: 'bold'
  },
  title: {
    color: PV.Colors.white,
    fontSize: PV.Fonts.sizes.md,
    fontWeight: 'bold',
    marginTop: 15
  },
  text: {
    color: PV.Colors.white,
    fontSize: PV.Fonts.sizes.md,
    marginVertical: 10,
    paddingLeft: 20
  }
})
