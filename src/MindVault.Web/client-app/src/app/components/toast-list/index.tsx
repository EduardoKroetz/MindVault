"use client"

import React, { useEffect,  } from 'react';
import { useToast } from '@/app/contexts/toastContext';

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
    <div className='d-flex flex-column gap-3' style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast align-items-center text-bg-${toast.success ? 'success' : 'danger'} border-0 `} role="alert" aria-live="assertive" aria-atomic="true" style= {{display: 'block'}}
        >
          <div className="d-flex">
            <div className="toast-body">
              { toast.message }
            </div>
            <button onClick={() => removeToast(toast.id)} type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastList;
