import { createContext } from "react";
import { ToastContextType } from "../interfaces/Toast";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export default ToastContext;
