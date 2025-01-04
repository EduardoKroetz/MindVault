"use client"

import React, { useEffect,  } from 'react';
import { useToast } from '@/app/contexts/toastContext';
import { Toast, ToastBody } from 'reactstrap';

const ToastList = () => {
  const { removeToast, toasts } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      if (toasts.length > 0) {
        removeToast(toasts[0].id);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [toasts, removeToast]); 

  return (
    <div className='w-100 d-flex align-items-end flex-column' style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`col-11 col-sm-8 col-md-6 col-lg-4 d-flex justify-content-end`}>
          <Toast
            className={`d-flex m-0 text-bg-${toast.success ? "success" : "danger"}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <ToastBody>{toast.message}</ToastBody>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
            ></button>
          </Toast>
        </div>
      ))}
    </div>
  );
};

export default ToastList;
