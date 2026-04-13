import { inject, provide, ref, computed, type Ref } from 'vue';

export type Locale = 'zh-CN' | 'zh-TW' | 'en';

const LOCALE_KEY = Symbol('locale');
const STORAGE_KEY = 'twt-locale';

export function provideLocale() {
  const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Locale | null;
  const locale = ref<Locale>(stored ?? 'zh-CN');

  const setLocale = (l: Locale) => {
    locale.value = l;
    localStorage.setItem(STORAGE_KEY, l);
  };

  provide(LOCALE_KEY, { locale, setLocale });
  return { locale, setLocale };
}

export function useLocale() {
  const ctx = inject<{ locale: Ref<Locale>; setLocale: (l: Locale) => void }>(LOCALE_KEY);
  if (!ctx) throw new Error('useLocale must be used inside provideLocale');
  return ctx;
}

export function useT<T extends Record<Locale, Record<string, unknown>>>(messages: T) {
  const { locale } = useLocale();
  return computed(() => messages[locale.value] as T[Locale]);
}
