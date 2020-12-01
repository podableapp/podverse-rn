import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import React from 'reactn'
import { View } from '../components'
import { translate } from '../lib/i18n'
import { PV } from '../resources'

type Props = {
  navigation: any
}

type State = {
  uri: string
}

export class AboutScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: translate('About brandName')
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <WebView source={{ uri: PV.URLs.officialWeb.about }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }
})
