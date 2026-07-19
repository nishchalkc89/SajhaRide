/**
 * Global toast/snackbar state. A single message at a time; showing a new one
 * replaces the current. The host component (ToastHost) renders it and auto-
 * dismisses.
 */

import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error';

type ToastState = {
  /** Monotonic id so repeated identical messages still re-trigger the host. */
  id: number;
  message: string | null;
  variant: ToastVariant;
  show: (message: string, variant?: ToastVariant) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  id: 0,
  message: null,
  variant: 'default',
  show: (message, variant = 'default') => set({ id: get().id + 1, message, variant }),
  hide: () => set({ message: null }),
}));

/** Convenience for imperative use outside React (event handlers, stores). */
export const toast = (message: string, variant?: ToastVariant) =>
  useToastStore.getState().show(message, variant);
