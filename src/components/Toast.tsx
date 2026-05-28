import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border pointer-events-auto ${
              t.type === "success"
                ? "bg-white/90 border-emerald-200/80 text-gray-800"
                : "bg-white/90 border-red-200/80 text-gray-800"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-500 shrink-0" size={20} />
            )}
            <span className="text-sm font-medium">{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
