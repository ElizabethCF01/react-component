"use client";

import type React from "react";
import "./toast.css";
import { useToast } from "../../hooks/useToast";

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toaster">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            {toast.description && (
              <div className="toast-description">{toast.description}</div>
            )}
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
