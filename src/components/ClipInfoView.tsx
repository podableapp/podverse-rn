import { StyleSheet, View } from 'react-native'
import React from 'reactn'
import { translate } from '../lib/i18n'
import { readableClipTime, safelyUnwrapNestedVariable } from '../lib/utility'
import { PV } from '../resources'
import { PVTrackPlayer, restartNowPlayingItemClip } from '../services/player'
import { button, core } from '../styles'
import { ActivityIndicator, Icon, ScrollView, TableSectionHeader, Text, TextLink } from './'

type Props = {
  createdAt: string
  endTime?: number
  handleClosePress: any
  hideDynamicAdsWarning?: boolean
  isLoading?: boolean
  isOfficialChapter?: boolean
  isOfficialSoundBite?: boolean
  isPublic?: boolean
  navigation: any
  ownerId?: string
  ownerIsPublic?: boolean
  ownerName?: string
  startTime: number
  title?: string
}

type State = {}

export class ClipInfoView extends React.PureComponent<Props, State> {
  _navToProfileScreen = () => {
    const { navigation, ownerId, ownerName } = this.props
    const user = {
      id: ownerId,
      name: ownerName
    }

    navigation.navigate(PV.RouteNames.ProfileScreen, {
      user,
      navigationTitle: translate('Profile')
    })
  }

  _handleEditPress = async () => {
    const { isPublic, navigation } = this.props
    const initialProgressValue = await PVTrackPlayer.getPosition()
    const isLoggedIn = safelyUnwrapNestedVariable(() => this.global.session.isLoggedIn, false)
    const globalTheme = safelyUnwrapNestedVariable(() => this.global.globalTheme, {})

    navigation.navigate(PV.RouteNames.MakeClipScreen, {
      initialProgressValue,
      initialPrivacy: isPublic,
      isEditing: true,
      isLoggedIn,
      globalTheme
    })
  }

  render() {
    const {
      endTime,
      handleClosePress,
      hideDynamicAdsWarning,
      isLoading,
      isOfficialChapter,
      isOfficialSoundBite,
      ownerIsPublic,
      ownerId,
      ownerName = translate('anonymous'),
      startTime,
      title = translate('untitled clip')
    } = this.props
    const { session } = this.global
    const userId = session.userInfo.id

    return (
      <View style={styles.wrapper}>
        {isLoading && <ActivityIndicator />}
        {!isLoading && (
          <View style={styles.wrapper}>
            <TableSectionHeader handleClosePress={handleClosePress} title={translate('Clip Info')} />
            <ScrollView style={styles.scrollView} transparent={true}>
              <View style={core.row}>
                <View style={styles.topText}>
                  <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={styles.title}>
                    {title}
                  </Text>
                  <Text fontSizeLargestScale={PV.Fonts.largeSizes.sm} style={styles.time}>
                    {readableClipTime(startTime, endTime)}
                  </Text>
                </View>
                {userId === ownerId && (
                  <View style={styles.topEditButtonWrapper}>
                    <Icon
                      name='pencil-alt'
                      onPress={() => this._handleEditPress()}
                      size={26}
                      style={button.iconOnlySmall}
                    />
                  </View>
                )}
              </View>
              <View style={styles.bottomTextWrapper}>
                {!isOfficialChapter && !isOfficialSoundBite && (
                  <View style={core.row}>
                    <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={styles.inlineText}>
                      By:{' '}
                    </Text>
                    {ownerIsPublic ? (
                      <TextLink
                        fontSizeLargestScale={PV.Fonts.largeSizes.md}
                        onPress={this._navToProfileScreen}
                        style={styles.link}>
                        {ownerName || translate('anonymous')}
                      </TextLink>
                    ) : (
                      <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={styles.inlineText}>
                        {translate('anonymous')}
                      </Text>
                    )}
                  </View>
                )}
                {!hideDynamicAdsWarning && (
                  <View style={styles.bottomTextWrapper}>
                    <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={styles.dynamicAdsWarning}>
                      {translate('Note If a podcast uses dynamic ads the clip start time may not stay accurate')}
                    </Text>
                  </View>
                )}
                <View style={styles.bottomTextWrapper}>
                  <TextLink onPress={restartNowPlayingItemClip} style={styles.link}>
                    {translate('Replay Clip')}
                  </TextLink>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomTextWrapper: {
    marginVertical: 12
  },
  divider: {
    marginBottom: 8
  },
  dynamicAdsWarning: {
    fontSize: PV.Fonts.sizes.md,
    fontStyle: 'italic'
  },
  inlineText: {
    flex: 0,
    fontSize: PV.Fonts.sizes.lg,
    marginBottom: 8
  },
  link: {
    flex: 0,
    fontSize: PV.Fonts.sizes.lg
  },
  scrollView: {
    flex: 1,
    padding: 8
  },
  text: {
    fontSize: PV.Fonts.sizes.md,
    marginBottom: 8
  },
  time: {
    fontSize: PV.Fonts.sizes.lg,
    marginBottom: 8
  },
  title: {
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    marginBottom: 8
  },
  topEditButtonWrapper: {
    flex: 0,
    marginLeft: 4
  },
  topText: {
    flex: 1
  },
  wrapper: {
    flex: 1
  }
})
