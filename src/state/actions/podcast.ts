import { getGlobal, setGlobal } from 'reactn'
import { safelyUnwrapNestedVariable } from '../../lib/utility'
import { PV } from '../../resources'
import PVEventEmitter from '../../services/eventEmitter'
import {
  getAddByRSSPodcastsLocally,
  removeAddByRSSPodcast as removeAddByRSSPodcastService
} from '../../services/parser'
import {
  getPodcast as getPodcastService,
  getSubscribedPodcasts as getSubscribedPodcastsService,
  insertOrRemovePodcastFromAlphabetizedArray,
  toggleSubscribeToPodcast as toggleSubscribeToPodcastService
} from '../../services/podcast'
import { updateDownloadedPodcasts } from './downloads'

export const getSubscribedPodcasts = async (subscribedPodcastIds: [string]) => {
  const data = await getSubscribedPodcastsService(subscribedPodcastIds)
  const subscribedPodcasts = data[0] || []
  const subscribedPodcastsTotalCount = data[1] || 0
  const addByRSSPodcasts = await getAddByRSSPodcastsLocally()

  setGlobal({
    addByRSSPodcasts,
    subscribedPodcasts,
    subscribedPodcastsTotalCount
  })
  return subscribedPodcasts
}

export const toggleSubscribeToPodcast = async (id: string) => {
  try {
    const globalState = getGlobal()
    const subscribedPodcastIds = await toggleSubscribeToPodcastService(id)
    const subscribedPodcast = await getPodcastService(id)
    let { subscribedPodcasts = [] } = globalState
    subscribedPodcasts = insertOrRemovePodcastFromAlphabetizedArray(subscribedPodcasts, subscribedPodcast)
    const subscribedPodcastsTotalCount = subscribedPodcasts ? subscribedPodcasts.length : 0

    setGlobal(
      {
        session: {
          ...globalState.session,
          userInfo: {
            ...globalState.session.userInfo,
            subscribedPodcastIds
          }
        },
        subscribedPodcasts,
        subscribedPodcastsTotalCount
      },
      async () => {
        await updateDownloadedPodcasts()
      }
    )
  } catch (error) {
    console.log('toggleSubscribeToPodcast action', error)
  }
}

export const removeAddByRSSPodcast = async (feedUrl: string) => {
  await removeAddByRSSPodcastService(feedUrl)
  const globalState = getGlobal()
  const subscribedPodcastIds = safelyUnwrapNestedVariable(() => globalState.session.userInfo.subscribedPodcastIds, [])
  await getSubscribedPodcasts(subscribedPodcastIds)
  PVEventEmitter.emit(PV.Events.PODCAST_SUBSCRIBE_TOGGLED)
}

export const checkIfSubscribedPodcast = (
  subscribedPodcastIds: string[],
  podcastId?: string,
  addByRSSPodcastFeedUrl?: string
) => {
  const globalState = getGlobal()
  let isSubscribed = subscribedPodcastIds.some((x: string) => podcastId && podcastId === x)

  if (!isSubscribed && addByRSSPodcastFeedUrl) {
    const subscribedPodcasts = safelyUnwrapNestedVariable(() => globalState.subscribedPodcasts, [])
    isSubscribed = subscribedPodcasts.some(
      (x: any) => x.addByRSSPodcastFeedUrl && x.addByRSSPodcastFeedUrl === addByRSSPodcastFeedUrl
    )
  }

  return isSubscribed
}
