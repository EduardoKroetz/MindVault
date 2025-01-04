"use client"

import { createContext, useContext, useState } from "react";

export interface IToast {
  id: number;
  message: string;
  success: boolean;
}

interface ToastContextType {
  toasts: IToast[];
  addToast: (message: string, success: boolean) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: any) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = (message: string, success: boolean) => {
    const id = new Date().getTime();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, success }
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
