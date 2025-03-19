import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import { Toast } from "../interfaces/Toast";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    toast: (props: Omit<Toast, "id">) => {
      context.addToast(props);
    },
    ...context,
  };
};
