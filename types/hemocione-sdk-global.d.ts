interface HemarcioChatHandle {
  setContext(context: Record<string, string | undefined>): void;
  destroy(): void;
}

interface Window {
  HemocioneSDK?: {
    createHemocioneChat(options: {
      chatUrl?: string;
      context?: Record<string, string | undefined>;
      position?: 'bottom-right' | 'bottom-left';
      offset?: { x?: number; y?: number };
    }): HemarcioChatHandle;
  };
}
