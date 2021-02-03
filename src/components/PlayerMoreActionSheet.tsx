import { Alert, Linking, StyleSheet, TouchableHighlight, View } from 'react-native'
import { Slider } from 'react-native-elements'
import SystemSetting from 'react-native-system-setting'
import { NavigationActions, StackActions } from 'react-navigation'
import React from 'reactn'
import { translate } from '../lib/i18n'
import { alertIfNoNetworkConnection } from '../lib/network'
import { safelyUnwrapNestedVariable } from '../lib/utility'
import { PV } from '../resources'
import { getAddByRSSPodcastLocally } from '../services/parser'
import { toggleAddByRSSPodcastFeedUrl } from '../state/actions/parser'
import { checkIfSubscribedPodcast, toggleSubscribeToPodcast } from '../state/actions/podcast'
import { actionSheetStyles, sliderStyles } from '../styles'
import { ActionSheet, Icon, Text } from './'

type Props = {
  handleDismiss: any
  initialVolume?: number
  navigation: any
  showModal?: boolean
  testID: string
}

type State = {
  volume?: number
}

let volumeListener = null as any

export class PlayerMoreActionSheet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    const volume = await SystemSetting.getVolume()
    this.setState({ volume })

    volumeListener = SystemSetting.addVolumeListener((data: any) => {
      const volume = data.value
      this.setState({ volume })
    })
  }

  componentWillUnmount() {
    SystemSetting.removeVolumeListener(volumeListener)
  }

  _updateVolume = (volume: number) => {
    SystemSetting.setVolume(volume)
    this.setState({ volume })
  }

  _handleToggleSubscribe = async () => {
    const { handleDismiss } = this.props

    const wasAlerted = await alertIfNoNetworkConnection(translate('subscribe to podcast'))
    if (wasAlerted) return
    const { nowPlayingItem } = this.global.player
    try {
      if (nowPlayingItem) {
        if (nowPlayingItem.addByRSSPodcastFeedUrl) {
          await toggleAddByRSSPodcastFeedUrl(nowPlayingItem.addByRSSPodcastFeedUrl)
        } else {
          await toggleSubscribeToPodcast(nowPlayingItem.podcastId)
        }
      }
      handleDismiss()
    } catch (error) {
      handleDismiss()
      if (error.response) {
        Alert.alert(PV.Alerts.SOMETHING_WENT_WRONG.title, PV.Alerts.SOMETHING_WENT_WRONG.message, PV.Alerts.BUTTONS.OK)
      }
    }
  }

  _handlePodcastPagePress = async () => {
    const { handleDismiss, navigation } = this.props
    const { player } = this.global
    const { episode, nowPlayingItem } = player
    const podcast = (episode && episode.podcast) || {}
    handleDismiss()

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: PV.RouteNames.TabNavigator })]
    })
    await navigation.dispatch(resetAction)
    if (nowPlayingItem && nowPlayingItem.addByRSSPodcastFeedUrl) {
      const podcast = await getAddByRSSPodcastLocally(nowPlayingItem.addByRSSPodcastFeedUrl)
      navigation.navigate(PV.RouteNames.PodcastScreen, {
        podcast,
        addByRSSPodcastFeedUrl: nowPlayingItem.addByRSSPodcastFeedUrl
      })
    } else {
      navigation.navigate(PV.RouteNames.PodcastScreen, {
        podcast
      })
    }
  }

  _handleOfficialPodcastPagePress = (podcast: any) => {
    const { handleDismiss } = this.props
    handleDismiss()
    Linking.openURL(podcast.linkUrl)
  }

  _handleOfficialEpisodePagePress = (episode: any) => {
    const { handleDismiss } = this.props
    handleDismiss()
    Linking.openURL(episode.linkUrl)
  }

  _headerActionSheetButtons = () => {
    const { globalTheme, player, session } = this.global
    const { episode, nowPlayingItem } = player
    const podcast = (episode && episode.podcast) || {}
    const subscribedPodcastIds = safelyUnwrapNestedVariable(() => session.userInfo.subscribedPodcastIds, [])
    const isSubscribed = checkIfSubscribedPodcast(
      subscribedPodcastIds,
      nowPlayingItem.podcastId,
      nowPlayingItem.addByRSSPodcastFeedUrl
    )

    const children = [
      <TouchableHighlight
        key='toggleSubscribe'
        onPress={this._handleToggleSubscribe}
        style={[actionSheetStyles.button, globalTheme.actionSheetButton]}
        underlayColor={safelyUnwrapNestedVariable(
          () => globalTheme.actionSheetButtonCancelUnderlay.backgroundColor,
          ''
        )}>
        <Text style={[actionSheetStyles.buttonText, globalTheme.actionSheetButtonText]}>
          {isSubscribed ? translate('Unsubscribe') : translate('Subscribe')}
        </Text>
      </TouchableHighlight>,
      <TouchableHighlight
        key='podcastPage'
        onPress={this._handlePodcastPagePress}
        style={[actionSheetStyles.button, globalTheme.actionSheetButton]}
        underlayColor={safelyUnwrapNestedVariable(
          () => globalTheme.actionSheetButtonCancelUnderlay.backgroundColor,
          ''
        )}>
        <Text style={[actionSheetStyles.buttonText, globalTheme.actionSheetButtonText]}>
          {translate('Go to Podcast')}
        </Text>
      </TouchableHighlight>
    ]

    if (podcast && podcast.linkUrl) {
      children.push(
        <TouchableHighlight
          key='officialPodcastPage'
          onPress={() => this._handleOfficialPodcastPagePress(podcast)}
          style={[actionSheetStyles.button, globalTheme.actionSheetButton]}
          underlayColor={safelyUnwrapNestedVariable(
            () => globalTheme.actionSheetButtonCancelUnderlay.backgroundColor,
            ''
          )}>
          <Text style={[actionSheetStyles.buttonText, globalTheme.actionSheetButtonText]}>
            {translate('Official Podcast Page')}
          </Text>
        </TouchableHighlight>
      )
    }

    if (episode && episode.linkUrl) {
      children.push(
        <TouchableHighlight
          key='officialEpisodePage'
          onPress={() => this._handleOfficialEpisodePagePress(episode)}
          style={[actionSheetStyles.button, globalTheme.actionSheetButton]}
          underlayColor={safelyUnwrapNestedVariable(
            () => globalTheme.actionSheetButtonCancelUnderlay.backgroundColor,
            ''
          )}>
          <Text style={[actionSheetStyles.buttonText, globalTheme.actionSheetButtonText]}>
            {translate('Official Episode Page')}
          </Text>
        </TouchableHighlight>
      )
    }

    return children
  }

  render() {
    const { handleDismiss, showModal, testID } = this.props
    const { volume } = this.state
    const { globalTheme, player } = this.global
    const { nowPlayingItem = {} } = player
    const items = this._headerActionSheetButtons()

    return (
      <ActionSheet showModal={showModal} testID={testID} title={(nowPlayingItem && nowPlayingItem.podcastTitle) || ''}>
        {items}
        <View
          key='volume'
          style={[actionSheetStyles.button, actionSheetStyles.buttonBottom, globalTheme.actionSheetButton]}>
          <View style={styles.volumeSliderWrapper}>
            <Icon name='volume-down' size={28} style={styles.volumeSliderIcon} />
            <Slider
              minimumValue={0}
              maximumValue={1}
              onSlidingComplete={(value) => this._updateVolume(value)}
              onValueChange={(value) => this._updateVolume(value)}
              style={styles.volumeSlider}
              thumbStyle={sliderStyles.thumbStyle}
              thumbTintColor={PV.Colors.brandColor}
              value={volume}
            />
            <Icon name='volume-up' size={28} />
          </View>
        </View>
        <TouchableHighlight
          key='cancel'
          onPress={handleDismiss}
          style={[actionSheetStyles.buttonCancel, globalTheme.actionSheetButtonCancel]}
          underlayColor={safelyUnwrapNestedVariable(
            () => globalTheme.actionSheetButtonCancelUnderlay.backgroundColor,
            ''
          )}>
          <Text style={[actionSheetStyles.buttonText, globalTheme.actionSheetButtonTextCancel]}>Cancel</Text>
        </TouchableHighlight>
      </ActionSheet>
    )
  }
}

const styles = StyleSheet.create({
  volumeSliderIcon: {},
  volumeSlider: {
    flex: 1,
    marginHorizontal: 20
  },
  volumeSliderWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 16
  }
})
