import { Alert, Linking, StyleSheet } from 'react-native'
import React from 'reactn'
import {
  ActivityIndicator,
  Divider,
  NavDismissIcon,
  NavHeaderButtonText,
  ScrollView,
  Text,
  TextInput,
  TextLink,
  View
} from '../components'
import { translate } from '../lib/i18n'
import { testProps } from '../lib/utility'
import { PV } from '../resources'
import { gaTrackPageView } from '../services/googleAnalytics'
import { getAddByRSSPodcastLocally } from '../services/parser'
import { addAddByRSSPodcast } from '../state/actions/parser'
import { core } from '../styles'

type Props = {
  navigation: any
}

type State = {
  isLoading?: boolean
  url?: string
}

export class AddPodcastByRSSScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: translate('Add by RSS'),
      headerLeft: <NavDismissIcon handlePress={navigation.dismiss} />,
      headerRight: (
        <NavHeaderButtonText
          disabled={navigation.getParam('_savePodcastByRSSUrlIsLoading')}
          handlePress={navigation.getParam('_handleSavePodcastByRSSURL')}
          text={translate('Save')}
        />
      )
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      _handleSavePodcastByRSSURL: this._handleSavePodcastByRSSURL
    })

    gaTrackPageView('/add-podcast-by-rss', 'Add Podcast By RSS Screen')
  }

  _navToRequestPodcastForm = async () => {
    Alert.alert(PV.Alerts.LEAVING_APP.title, PV.Alerts.LEAVING_APP.message, [
      { text: translate('Cancel') },
      { text: translate('Yes'), onPress: () => Linking.openURL(PV.URLs.requestPodcast) }
    ])
  }

  _handleChangeText = (value: string) => {
    this.setState({ url: value })
  }

  _handleSavePodcastByRSSURL = async () => {
    const { isLoading, url } = this.state
    if (isLoading) {
      return
    } else if (url) {
      this.props.navigation.setParams({ _savePodcastByRSSUrlIsLoading: true })
      this.setState({ isLoading: true }, async () => {
        try {
          await addAddByRSSPodcast(url)
          this.props.navigation.setParams({
            _savePodcastByRSSUrlIsLoading: false
          })
          this.setState({ isLoading: false })
          const podcast = await getAddByRSSPodcastLocally(url)
          this.props.navigation.navigate(PV.RouteNames.PodcastScreen, {
            podcast,
            addByRSSPodcastFeedUrl: podcast.addByRSSPodcastFeedUrl
          })
        } catch (error) {
          console.log('_handleSavePodcastByRSSURL', error)
          Alert.alert(
            PV.Alerts.SOMETHING_WENT_WRONG.title,
            PV.Alerts.SOMETHING_WENT_WRONG.message,
            PV.Alerts.BUTTONS.OK
          )
          this.props.navigation.setParams({
            _savePodcastByRSSUrlIsLoading: false
          })
          this.setState({ isLoading: false })
        }
      })
    }
  }

  render() {
    const { globalTheme } = this.global
    const { isLoading, url } = this.state

    return (
      <View style={styles.content} {...testProps('add_podcast_by_rss_screen_view')}>
        {isLoading && <ActivityIndicator />}
        {!isLoading && (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={core.textInputLabel}>
              {translate('RSS Feed')}
            </Text>
            <TextInput
              autoCapitalize='none'
              autoCompleteType='off'
              fontSizeLargestScale={PV.Fonts.largeSizes.md}
              onChangeText={this._handleChangeText}
              placeholder={translate('paste RSS feed link here')}
              returnKeyType='done'
              style={[styles.textInput, globalTheme.textInput]}
              underlineColorAndroid='transparent'
              value={url}
            />
            <Divider style={styles.divider} />
            <Text fontSizeLargestScale={PV.Fonts.largeSizes.sm} style={styles.text}>
              {translate('AddPodcastByRSSScreenText1')}
            </Text>
            <Text fontSizeLargestScale={PV.Fonts.largeSizes.sm} style={styles.text}>
              {translate('AddPodcastByRSSScreenText2')}
            </Text>
            <Text fontSizeLargestScale={PV.Fonts.largeSizes.sm} style={styles.text}>
              {translate('AddPodcastByRSSScreenText3')}
            </Text>
            <Text fontSizeLargestScale={PV.Fonts.largeSizes.sm} style={styles.text}>
              {translate('AddPodcastByRSSScreenText4')}
            </Text>
            <TextLink
              fontSizeLargestScale={PV.Fonts.largeSizes.sm}
              onPress={this._navToRequestPodcastForm}
              style={styles.textLink}>
              {translate('Request Podcast')}
            </TextLink>
          </ScrollView>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  divider: {
    marginVertical: 8
  },
  scrollViewContent: {
    paddingHorizontal: 12,
    paddingVertical: 16
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: PV.Colors.grayLight,
    marginVertical: 30
  },
  text: {
    fontSize: PV.Fonts.sizes.md,
    marginVertical: 12,
    textAlign: 'left'
  },
  textInput: {
    fontSize: PV.Fonts.sizes.xl,
    marginBottom: 16
  },
  textLink: {
    fontSize: PV.Fonts.sizes.lg,
    paddingVertical: 16,
    textAlign: 'center'
  }
})
