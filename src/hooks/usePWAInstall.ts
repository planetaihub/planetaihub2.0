import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAStoreState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  isIOS: boolean;
  isModalOpen: boolean;
}

const state: PWAStoreState = {
  deferredPrompt: null,
  isInstalled: false,
  isIOS: false,
  isModalOpen: false,
};

const listeners = new Set<() => void>();
let initialized = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function initGlobalPWAListeners() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const displayModeQuery = window.matchMedia('(display-mode: standalone)');
  const checkStandalone = () =>
    displayModeQuery.matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  state.isInstalled = checkStandalone();

  const userAgent = window.navigator.userAgent.toLowerCase();
  state.isIOS =
    /iphone|ipad|ipod/.test(userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    state.deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    state.isInstalled = true;
    state.deferredPrompt = null;
    state.isModalOpen = false;
    notify();
  });

  displayModeQuery.addEventListener?.('change', () => {
    state.isInstalled = checkStandalone();
    notify();
  });
}

export function setInstallModalOpen(open: boolean) {
  state.isModalOpen = open;
  notify();
}

export async function triggerSmartPWAInstall(): Promise<boolean> {
  if (state.deferredPrompt) {
    try {
      await state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        state.isInstalled = true;
        state.deferredPrompt = null;
        state.isModalOpen = false;
        notify();
        return true;
      }
      return false;
    } catch {
      // Fall back to guided install modal if native prompt cannot open in context
    }
  }

  state.isModalOpen = true;
  notify();
  return false;
}

export function usePWAInstall() {
  initGlobalPWAListeners();

  const [, setTick] = useState(0);

  useEffect(() => {
    initGlobalPWAListeners();
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    // Sync immediately in case standalone/prompt changed prior to mount
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    isInstallable: Boolean(state.deferredPrompt),
    isInstalled: state.isInstalled,
    isIOS: state.isIOS,
    isModalOpen: state.isModalOpen,
    openInstallModal: () => setInstallModalOpen(true),
    closeInstallModal: () => setInstallModalOpen(false),
    install: triggerSmartPWAInstall,
  };
}
