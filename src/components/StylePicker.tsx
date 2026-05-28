import { motion } from "motion/react";
import { Heart, MessageCircle, Smile, Award, Feather } from "lucide-react";

export const LETTER_STYLES = [
  {
    id: "Romántico y Nostálgico",
    label: "Romántico",
    desc: "Ternura, recuerdos y emoción profunda",
    icon: Heart,
  },
  {
    id: "Directo y Sincero",
    label: "Sincero",
    desc: "Claro, honesto y sin rodeos",
    icon: MessageCircle,
  },
  {
    id: "Divertido y Ligero",
    label: "Ligero",
    desc: "Calidez con un toque de humor",
    icon: Smile,
  },
  {
    id: "Formal y Respetuoso",
    label: "Formal",
    desc: "Elegante y considerado",
    icon: Award,
  },
  {
    id: "Poético y Profundo",
    label: "Poético",
    desc: "Metáforas y belleza literaria",
    icon: Feather,
  },
] as const;

export function StylePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (style: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {LETTER_STYLES.map((s) => {
        const Icon = s.icon;
        const selected = value === s.id;
        return (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            whileTap={{ scale: 0.98 }}
            className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
              selected
                ? "border-rose-400/80 bg-white shadow-lg shadow-rose-100/60 ring-2 ring-rose-200/50"
                : "border-transparent bg-white/60 hover:bg-white hover:border-rose-100 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  selected ? "bg-gradient-to-br from-rose-400 to-rose-600 text-white" : "bg-rose-50 text-rose-500"
                }`}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className={`font-semibold ${selected ? "text-rose-800" : "text-gray-800"}`}>{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.desc}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
