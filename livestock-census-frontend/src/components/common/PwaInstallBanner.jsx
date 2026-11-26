import { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function PwaInstallBanner({ className = '' }) {
  const {
    canInstallPwa,
    isInstalled,
    isIos,
    isSecureContext,
    triggerPwaInstall,
  } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  // Native Android / Desktop Chrome install popup ready
  if (canInstallPwa) {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-xl bg-teal-50 border border-teal-200 px-3.5 py-2 text-teal-950 ${className}`}
      >
        <div className="flex items-center gap-2 text-xs font-medium min-w-0">
          <Smartphone className="h-4 w-4 text-teal-700 shrink-0" />
          <span className="truncate">Install app for quick field access.</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={triggerPwaInstall}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 hover:bg-teal-800 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss install banner"
            className="p-1 text-teal-700/70 hover:text-teal-900 rounded-md cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari manual Add to Home Screen guide
  if (isIos && isSecureContext) {
    return (
      <div
        className={`flex items-center justify-between gap-2.5 rounded-xl bg-teal-50 border border-teal-200 px-3.5 py-2 text-teal-950 ${className}`}
      >
        <div className="flex items-center gap-2 text-[11px] leading-snug">
          <Share className="h-3.5 w-3.5 text-teal-700 shrink-0" />
          <span>
            Tap <strong>Share</strong> &rarr; <strong>Add to Home Screen</strong> to install.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss iOS install hint"
          className="p-1 text-teal-700/70 hover:text-teal-900 rounded-md shrink-0 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
