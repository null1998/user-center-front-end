import defaultSettings from '@/settings'

const title = defaultSettings.title || '财政票据管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
