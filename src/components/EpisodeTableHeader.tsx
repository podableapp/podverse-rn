import React from 'react'
import { StyleSheet } from 'react-native'
import { useGlobal } from 'reactn'
import { translate } from '../lib/i18n'
import { readableDate, testProps } from '../lib/utility'
import { PV } from '../resources'
import { core } from '../styles'
import { ActivityIndicator, FastImage, IndicatorDownload, MoreButton, Text, View } from './'

type Props = {
  downloadedEpisodeIds?: any
  downloadsActive?: any
  handleMorePress?: any
  id: string
  isLoading?: boolean
  isNotFound?: boolean
  podcastImageUrl?: string
  pubDate?: string
  testID: string
  title: string
}

export const EpisodeTableHeader = (props: Props) => {
  const {
    downloadedEpisodeIds = {},
    downloadsActive = {},
    handleMorePress,
    id,
    isLoading,
    isNotFound,
    podcastImageUrl,
    pubDate = '',
    testID,
    title
  } = props

  const isDownloading = downloadsActive[id]
  const isDownloaded = downloadedEpisodeIds[id]

  const [fontScaleMode] = useGlobal('fontScaleMode')

  const titleNumberOfLines = [PV.Fonts.fontScale.larger, PV.Fonts.fontScale.largest].includes(fontScaleMode) ? 1 : 2

  return (
    <View style={styles.wrapper}>
      {isLoading && <ActivityIndicator />}
      {!isLoading && !isNotFound && (
        <View style={styles.innerWrapper}>
          <FastImage source={podcastImageUrl} styles={styles.image} />
          <View style={styles.textWrapper}>
            <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} numberOfLines={titleNumberOfLines} style={styles.title}>
              {title}
            </Text>
            <View style={styles.textWrapperBottomRow}>
              {!!pubDate && (
                <Text fontSizeLargestScale={PV.Fonts.largeSizes.sm} isSecondary={true} style={styles.pubDate}>
                  {readableDate(pubDate)}
                </Text>
              )}
              {isDownloaded && <IndicatorDownload />}
            </View>
          </View>
          {handleMorePress && (
            <MoreButton handleShowMore={handleMorePress} height={92} isLoading={isDownloading} testID={testID} />
          )}
        </View>
      )}
      {!isLoading && isNotFound && (
        <View style={core.view}>
          <Text
            fontSizeLargerScale={PV.Fonts.largeSizes.md}
            fontSizeLargestScale={PV.Fonts.largeSizes.md}
            style={styles.notFoundText}>
            {translate('Episode Not Found')}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonView: {
    flex: 0,
    marginLeft: 8,
    marginRight: 8
  },
  image: {
    flex: 0,
    height: PV.Table.cells.podcast.image.height,
    marginRight: 12,
    width: PV.Table.cells.podcast.image.width
  },
  innerWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 8
  },
  notFoundText: {
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold
  },
  pubDate: {
    flex: 0,
    fontSize: PV.Fonts.sizes.sm,
    marginTop: 3
  },
  textWrapper: {
    flex: 1,
    marginRight: 4,
    paddingTop: 2
  },
  textWrapperBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  title: {
    flex: 0,
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold
  },
  wrapper: {
    flexDirection: 'row',
    minHeight: PV.Table.cells.podcast.wrapper.height
  }
})
