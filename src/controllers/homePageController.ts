import { homePageData } from '../models/homePageData'
import type { HomePageViewModel } from '../models/homePageModel'

export function getHomePageViewModel(): HomePageViewModel {
  const { announcements, sidePanels, ...pageContent } = homePageData

  return {
    ...pageContent,
    announcements: announcements.slice(0, 4),
    sidePanels: sidePanels.slice(0, 1),
  }
}
