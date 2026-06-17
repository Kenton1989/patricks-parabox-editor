import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zhCN from './locales/zh-CN'

export const locales = ['en', 'zh-CN'] as const
export type AppLocale = (typeof locales)[number]

const messages = {
  en,
  'zh-CN': zhCN,
}

function isAppLocale(locale: string): locale is AppLocale {
  return (locales as readonly string[]).includes(locale)
}

function resolveBrowserLocale(): AppLocale {
  const language = navigator.language

  if (isAppLocale(language)) return language
  if (language.toLowerCase().startsWith('zh')) return 'zh-CN'

  return 'en'
}

function resolveLocale(): AppLocale {
  const savedLocale = localStorage.getItem('locale')

  return savedLocale && isAppLocale(savedLocale) ? savedLocale : resolveBrowserLocale()
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveLocale(),
  fallbackLocale: 'en',
  messages,
})
