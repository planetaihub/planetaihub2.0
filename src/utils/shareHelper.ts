export interface SharePayload {
  title: string;
  text?: string;
  url: string;
}

type ToastListener = (message: string) => void;

const toastListeners = new Set<ToastListener>();

export function subscribeShareToast(listener: ToastListener): () => void {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

function emitShareToast(message: string) {
  toastListeners.forEach((listener) => listener(message));
}

function fallbackCopyText(value: string): boolean {
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

/**
 * Invokes the native Web Share API when supported, falling back to
 * clipboard copy + floating cyan toast confirmation ("Link copied to clipboard ✓").
 */
export async function shareContent({
  title,
  text,
  url,
}: SharePayload): Promise<'shared' | 'copied' | 'cancelled'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
      // Fall through to clipboard fallback when Web Share is blocked (e.g. iframe preview)
    }
  }

  let copied = false;
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = fallbackCopyText(url);
    }
  } else {
    copied = fallbackCopyText(url);
  }

  if (copied) {
    emitShareToast('Link copied to clipboard ✓');
    return 'copied';
  }

  return 'cancelled';
}
