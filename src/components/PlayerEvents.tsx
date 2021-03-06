import debounce from 'lodash/debounce'
import { Alert, StyleSheet, View } from 'react-native'
import React from 'reactn'
import { refreshDownloadedPodcasts } from '../lib/downloadedPodcast'
import { PV } from '../resources'
import PVEventEmitter from '../services/eventEmitter'
import { getNowPlayingItem } from '../services/player'
import { clearNowPlayingItem, showMiniPlayer, updatePlaybackState, updatePlayerState } from '../state/actions/player'
import { getQueueItems } from '../state/actions/queue'

type Props = {}

type State = {}

export class PlayerEvents extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this._playerCannotStreamWithoutWifi = debounce(this._playerCannotStreamWithoutWifi, 3000)
  }

  componentDidMount() {
    PVEventEmitter.on(PV.Events.PLAYER_CANNOT_STREAM_WITHOUT_WIFI, this._playerCannotStreamWithoutWifi)
    PVEventEmitter.on(PV.Events.PLAYER_RESUME_AFTER_CLIP_HAS_ENDED, this._refreshNowPlayingItem)
    PVEventEmitter.on(PV.Events.PLAYER_STATE_CHANGED, this._playerStateUpdated)
    PVEventEmitter.on(PV.Events.PLAYER_TRACK_CHANGED, this._handlePlayerTrackChanged)
    PVEventEmitter.on(PV.Events.PLAYER_PLAYBACK_ERROR, this._handlePlayerPlaybackError)
  }

  componentWillUnmount() {
    PVEventEmitter.removeListener(PV.Events.PLAYER_CANNOT_STREAM_WITHOUT_WIFI)
    PVEventEmitter.removeListener(PV.Events.PLAYER_RESUME_AFTER_CLIP_HAS_ENDED)
    PVEventEmitter.removeListener(PV.Events.PLAYER_STATE_CHANGED)
    PVEventEmitter.removeListener(PV.Events.PLAYER_TRACK_CHANGED)
    PVEventEmitter.removeListener(PV.Events.PLAYER_PLAYBACK_ERROR)
  }

  _handlePlayerTrackChanged = async () => {
    refreshDownloadedPodcasts()
    this._refreshNowPlayingItem()
  }

  _playerCannotStreamWithoutWifi = async () => {
    Alert.alert(
      PV.Alerts.PLAYER_CANNOT_STREAM_WITHOUT_WIFI.title,
      PV.Alerts.PLAYER_CANNOT_STREAM_WITHOUT_WIFI.message,
      PV.Alerts.BUTTONS.OK
    )
  }

  _handlePlayerPlaybackError = async () => {
    await updatePlaybackState(PV.Player.errorState)
  }

  _playerStateUpdated = () => updatePlaybackState()

  _refreshNowPlayingItem = async () => {
    const nowPlayingItem = await getNowPlayingItem()

    if (nowPlayingItem) {
      await updatePlayerState(nowPlayingItem)
      showMiniPlayer()
    } else {
      await clearNowPlayingItem()
    }

    await updatePlaybackState()
    await getQueueItems()
  }

  render() {
    return <View style={styles.view} />
  }
}

const styles = StyleSheet.create({
  view: {
    height: 0,
    width: 0
  }
})
