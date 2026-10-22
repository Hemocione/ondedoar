import {
  HEMARCIO_BUBBLE_OPTIONS,
  HEMARCIO_SDK_URL,
  buildHemarcioContext,
  resolveHemarcioEnabled,
  shouldShowHemarcio,
} from '~/utils/hemarcioBubble';

function isInsideIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function loadSdk(): Promise<void> {
  if (window.HemocioneSDK) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = HEMARCIO_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar o SDK do Hemarcio'));
    document.head.appendChild(script);
  });
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const enabled = resolveHemarcioEnabled(config.hemarcioEnabled);
  if (!enabled) return;

  const router = useRouter();
  const iframedQuery = new URLSearchParams(window.location.search).get('iframed') === 'true';
  const inIframe = isInsideIframe();
  const visibleFor = (path: string) => shouldShowHemarcio({ enabled, iframedQuery, inIframe, path });

  let chat: HemarcioChatHandle | null = null;
  let loading = false;

  async function sync(path: string) {
    if (!visibleFor(path)) {
      chat?.destroy();
      chat = null;
      return;
    }
    if (chat) {
      chat.setContext(buildHemarcioContext(path));
      return;
    }
    if (loading) return;
    loading = true;
    try {
      await loadSdk();
      if (!visibleFor(router.currentRoute.value.path) || chat) return;
      chat = window.HemocioneSDK!.createHemocioneChat({
        chatUrl: String(config.hemarcioChatUrl),
        context: buildHemarcioContext(router.currentRoute.value.path),
        ...HEMARCIO_BUBBLE_OPTIONS,
      });
    } catch (err) {
      console.warn(err);
    } finally {
      loading = false;
    }
  }

  nuxtApp.hook('app:mounted', () => {
    sync(router.currentRoute.value.path);
    router.afterEach((to) => {
      sync(to.path);
    });
  });
});
