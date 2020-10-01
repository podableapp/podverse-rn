import { Alert, Linking, StyleSheet } from 'react-native'
import React from 'reactn'
import { HTMLScrollView, View } from '../components'
import { translate } from '../lib/i18n'
import { testProps } from '../lib/utility'
import { PV } from '../resources'
import { gaTrackPageView } from '../services/googleAnalytics'

type Props = {}

type State = {}

export class TermsOfServiceScreen extends React.Component<Props, State> {
  static navigationOptions = () => {
    return {
      title: translate('Terms of Service')
    }
  }

  componentDidMount() {
    gaTrackPageView('/terms-of-service', 'Terms of Service Screen')
  }

  showLeavingAppAlert = (url: string) => {
    Alert.alert(PV.Alerts.LEAVING_APP.title, PV.Alerts.LEAVING_APP.message, [
      { text: 'Cancel' },
      { text: 'Yes', onPress: () => Linking.openURL(url) }
    ])
  }

  render() {
    return (
      <View style={styles.content} {...testProps('terms_of_service_screen_view')}>
        <HTMLScrollView fontSizeLargestScale={PV.Fonts.largeSizes.md} html={PV.HTML.termsOfService} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
})
