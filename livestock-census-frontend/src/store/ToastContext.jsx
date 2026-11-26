import { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from './toastContextValue';

const TOAST_STYLES = {
  success: {
    container: 'bg-white border-emerald-300 border-l-4 border-l-[#0B5D36] text-slate-900',
    iconBg: 'bg-emerald-100 text-[#0B5D36]',
    icon: faCircleCheck,
    bar: 'bg-[#0B5D36]',
    defaultTitle: 'Success',
  },
  error: {
    container: 'bg-white border-rose-300 border-l-4 border-l-rose-600 text-slate-900',
    iconBg: 'bg-rose-100 text-rose-600',
    icon: faCircleExclamation,
    bar: 'bg-rose-600',
    defaultTitle: 'Action Failed',
  },
  info: {
    container: 'bg-white border-sky-300 border-l-4 border-l-sky-600 text-slate-900',
    iconBg: 'bg-sky-100 text-sky-700',
    icon: faCircleInfo,
    bar: 'bg-sky-600',
    defaultTitle: 'Notification',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', title = '') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const resolvedType = TOAST_STYLES[type] ? type : 'success';
    setToasts((prev) => [
      ...prev.slice(-1),
      { id, message, type: resolvedType, title },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}

      {/* Compact Bottom Toast Viewport — Clears mobile bottom bar & desktop header */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-24 lg:bottom-5 inset-x-3 sm:inset-x-auto sm:right-5 z-50 flex flex-col items-center sm:items-end gap-2 pointer-events-none"
        >
          {toasts.map((item) => {
            const style = TOAST_STYLES[item.type] || TOAST_STYLES.success;
            return (
              <div
                key={item.id}
                role="status"
                className={`pointer-events-auto relative overflow-hidden w-fit max-w-[300px] sm:max-w-[330px] rounded-xl border shadow-[0_10px_26px_rgba(15,23,42,0.16)] px-3 py-2 animate-toast-in ${style.container}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${style.iconBg}`}
                  >
                    <FontAwesomeIcon icon={style.icon} className="text-xs" />
                  </span>
                  <div className="min-w-0 pr-1">
                    <p className="text-[11px] font-extrabold tracking-tight text-slate-900 leading-tight">
                      {item.title || style.defaultTitle}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(item.id)}
                    aria-label="Close notification"
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer shrink-0"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-[11px]" />
                  </button>
                </div>
                <div
                  className={`absolute bottom-0 left-0 h-0.5 w-full opacity-75 animate-toast-bar ${style.bar}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}
