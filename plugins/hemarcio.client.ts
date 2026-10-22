import { useLocationPromptStore } from '~/store/locationPrompt';
import {
  HEMARCIO_BUBBLE_OPTIONS,
  HEMARCIO_SDK_URLS,
  buildHemarcioContext,
  resolveHemarcioEnabled,
  shouldShowHemarcio,
} from '~/utils/hemarcioBubble';
import {
  createHemarcioController,
  createSdkLoader,
  isInsideIframe,
  readIframedQuery,
} from '~/utils/hemarcioController';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const enabled = resolveHemarcioEnabled(config.hemarcioEnabled);
  if (!enabled) return;

  const router = useRouter();
  const locationPrompt = useLocationPromptStore();
  // lido uma vez: ?iframed=true some apos a primeira navegacao
  const iframedQuery = readIframedQuery(window.location.search);
  const inIframe = isInsideIframe();

  const available = ref(false);
  const controller = createHemarcioController({
    getRoute: () => router.currentRoute.value,
    isVisible: (route) =>
      shouldShowHemarcio({
        enabled,
        iframedQuery,
        inIframe,
        path: route.path,
        locationPromptVisible: locationPrompt.visible,
      }),
    buildContext: (route) => buildHemarcioContext(route.path),
    isEnabled: () => true,
    loadSdk: createSdkLoader(HEMARCIO_SDK_URLS),
    chatUrl: String(config.hemarcioChatUrl),
    chatOptions: HEMARCIO_BUBBLE_OPTIONS,
  });

  controller.subscribe((value) => {
    available.value = value;
  });

  nuxtApp.hook('app:mounted', () => {
    void controller.sync();
    router.afterEach(() => {
      void controller.sync();
    });
    watch(
      () => locationPrompt.visible,
      () => {
        void controller.sync();
      },
    );
  });

  return { provide: { hemarcioAsk: { available, ask: controller.ask } } };
});
