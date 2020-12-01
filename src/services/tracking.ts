import axios from 'axios'
import { getGlobal } from 'reactn'
import { generateQueryParams, getAppUserAgent } from '../lib/utility'
import { gaTrackPageView } from './googleAnalytics'

export const trackPageView = async (path: string, title: string) => {
  const global = getGlobal()
  const { player } = global
  const { nowPlayingItem = {} } = player
  const { episodeTitle, podcastTitle } = nowPlayingItem

  const queryObj = {
    cd: title ? title : '',
    cg1: podcastTitle ? podcastTitle : '',
    cg2: null, // episodeNumber
    cg3: episodeTitle ? episodeTitle : ''
    // cg4: orgID ? orgID : '',
    // cg5: userid ? userid : '',
    // uid: userid ? userid : ''
  }

  await gaTrackPageView(path, title, queryObj)
  await podableTrackPageView(queryObj)
}

export const trackPlayerScreenPageView = (item: any, global: any) => {
  // if (item.clipId) {
  //   trackPageView(
  //     '/clip/' + item.clipId,
  //     'Player Screen - Clip - ' + item.podcastTitle + ' - ' + item.episodeTitle + ' - ' + item.clipTitle
  //   )
  // }
  if (item.episodeId) {
    trackPageView(
      '/episode/' + item.episodeId,
      'Player Screen - Episode - ' + item.podcastTitle + ' - ' + item.episodeTitle
    )
  }
  if (item.podcastId) {
    trackPageView('/podcast/' + item.podcastId, 'Player Screen - Podcast - ' + item.podcastTitle)
  }
}

const podableTrackPageView = async (queryObj: any) => {
  const endpoint = 'https://v3msw6f5o8.execute-api.us-west-2.amazonaws.com/dev'
  const queryString = generateQueryParams(queryObj)
  const userAgent = await getAppUserAgent()

  try {
    await axios({
      url: `${endpoint}?${queryString}`,
      method: 'GET',
      headers: {
        'User-Agent': userAgent
      }
    })
  } catch (error) {
    console.log('podableTrackPageView error', error)
  }
}
