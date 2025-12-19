import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((msg, { type = "info", timeout = 3000 } = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, msg, type }]);
    if (timeout) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), timeout);
    }
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const Icon = ({ type }) => {
    if (type === "success") return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (type === "error") return <AlertCircle className="w-4 h-4 text-error" />;
    return <Info className="w-4 h-4 text-error" />;
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-100 space-y-2">
        {toasts.map(({ id, msg, type }) => (
          <div
            key={id}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-surface text-text"
          >
            <Icon type={type} />
            <span className="text-xs">{msg}</span>
            <button onClick={() => remove(id)} className="ml-2 text-textMuted hover:text-text text-xs">Dismiss</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
