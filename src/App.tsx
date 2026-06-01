import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db, loginWithGoogle, logout } from "./lib/firebase";
import { Letter } from "./types";
import {
  Heart,
  Send,
  History,
  Plus,
  LogOut,
  Copy,
  Trash2,
  Check,
  Loader2,
  MessageSquareHeart,
  Moon,
  Sparkles,
  RefreshCw,
  PenLine,
  Quote,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { StylePicker } from "./components/StylePicker";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { useTypewriter } from "./hooks/useTypewriter";

const LOADING_PHRASES = [
  "Buscando las palabras perfectas...",
  "Tejiendo emociones en cada línea...",
  "Recordando lo que el corazón quiere decir...",
];

const Navbar = ({ user }: { user: User | null }) => (
  <nav className="glass-nav flex items-center justify-between px-6 py-4 sticky top-0 z-50">
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/40 via-violet-500/35 to-pink-400/30 blur-lg rounded-full" />
        <Heart className="relative text-violet-600 fill-pink-500" size={26} />
      </div>
      <div>
        <span className="font-serif text-xl font-semibold tracking-tight heading-gradient">
          Ecos del Corazón
        </span>
        <p className="text-[10px] uppercase tracking-[0.2em] bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent -mt-0.5 font-medium">
          Cartas de amor
        </p>
      </div>
    </motion.div>
    {user && (
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-500 max-w-[120px] truncate">
          {user.displayName?.split(" ")[0]}
        </span>
        <img
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=ede9fe&color=5b21b6`}
          alt="Perfil"
          className="w-9 h-9 rounded-full border-2 border-white shadow-md ring-2 ring-violet-200/80"
        />
        <button
          onClick={logout}
          className="p-2.5 hover:bg-romantic-50 rounded-xl transition-colors text-gray-500 hover:text-romantic-600"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    )}
  </nav>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6">
    <AnimatedBackground />
    <motion.div
      animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/30 via-fuchsia-400/25 to-pink-400/30 blur-2xl rounded-full scale-150" />
      <Heart className="relative text-violet-500" size={56} fill="currentColor" />
    </motion.div>
    <p className="font-serif text-xl text-romantic-700 italic">Abriendo tu buzón del alma...</p>
  </div>
);

const LoginScreen = () => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <AnimatedBackground />
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-lg w-full glass-card rounded-[2rem] p-10 md:p-12 text-center relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-indigo-400/30 to-violet-500/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-fuchsia-400/25 to-pink-400/20 rounded-full blur-3xl" />

      <div className="relative mb-8 flex justify-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="wax-seal w-20 h-20 rounded-full flex items-center justify-center"
        >
          <MessageSquareHeart size={36} className="text-white/95" />
        </motion.div>
      </div>

      <h1 className="font-serif text-4xl md:text-5xl mb-3 font-semibold shimmer-text">
        Cartas que Sanan
      </h1>
      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        Reconecta con quien más importa. Palabras sinceras, escritas con el alma y la magia de la inteligencia artificial.
      </p>

      <ul className="text-left space-y-3 mb-10 text-sm text-gray-600">
        {[
          "Cartas únicas según tu historia y tono",
          "Guarda y revive tus mensajes más especiales",
          "Privado y seguro con tu cuenta de Google",
        ].map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-2"
          >
            <Sparkles size={14} className="text-gold-500 shrink-0" />
            {item}
          </motion.li>
        ))}
      </ul>

      <button
        onClick={() => loginWithGoogle().catch(console.error)}
        className="relative w-full flex items-center justify-center gap-3 bg-white/90 border border-violet-200/80 rounded-2xl py-4 px-6 font-semibold text-gray-700 hover:shadow-lg hover:shadow-violet-200/40 hover:border-violet-300 transition-all active:scale-[0.98]"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/controller/google.svg"
          alt=""
          className="w-5 h-5"
        />
        Continuar con Google
      </button>
    </motion.div>
  </div>
);

function formatDate(letter: Letter) {
  if (!letter.createdAt?.seconds) return "Reciente";
  return new Date(letter.createdAt.seconds * 1000).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"home" | "create" | "history">("home");
  const [history, setHistory] = useState<Letter[]>([]);

  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [style, setStyle] = useState("Romántico y Nostálgico");
  const [generating, setGenerating] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState(0);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { displayed: typedLetter, done: typewriterDone } = useTypewriter(generatedLetter, 10);

  const showToast = useCallback((text: string, type: ToastMessage["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "letters"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setHistory(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Letter));
      },
      (error) => console.error("Firestore error:", error)
    );
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setLoadingPhrase((p) => (p + 1) % LOADING_PHRASES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [generating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedLetter(null);
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName: recipient, context, style }),
      });
      const data = await res.json();
      if (data.content) {
        setGeneratedLetter(data.content);
      } else {
        showToast("No pudimos generar la carta. Intenta de nuevo.", "error");
      }
    } catch {
      showToast("Error de conexión. Revisa tu red e intenta otra vez.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const saveLetter = async () => {
    if (!user || !generatedLetter) return;
    try {
      await addDoc(collection(db, "letters"), {
        userId: user.uid,
        recipientName: recipient,
        context,
        style,
        content: generatedLetter,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setGeneratedLetter(null);
      setRecipient("");
      setContext("");
      setView("history");
      showToast("Carta guardada en tu corazón digital");
    } catch {
      showToast("No se pudo guardar. Intenta de nuevo.", "error");
    }
  };

  const copyToClipboard = async (text: string, id?: string) => {
    await navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    showToast("Texto copiado al portapapeles");
  };

  const shareLetter = async (text: string, name: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Carta para ${name}`, text });
        return;
      } catch {
        /* fallback to copy */
      }
    }
    copyToClipboard(text);
  };

  const deleteLetter = async (id: string | undefined) => {
    if (!id || !confirm("¿Eliminar esta carta para siempre?")) return;
    try {
      await deleteDoc(doc(db, "letters", id));
      showToast("Carta eliminada");
    } catch {
      showToast("No se pudo eliminar.", "error");
    }
  };

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnimatedBackground />
      <Navbar user={user} />
      <ToastContainer toasts={toasts} />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 pb-24">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="py-10 md:py-16 text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs uppercase tracking-[0.25em] text-romantic-500 mb-4 font-medium"
              >
                Bienvenida de vuelta
              </motion.p>
              <h2 className="font-serif text-4xl md:text-6xl font-semibold mb-6 leading-tight">
                <span className="heading-gradient">Las palabras que</span>
                <br />
                <span className="shimmer-text italic">cruzan distancias</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
                A veces el silencio dura demasiado. Deja que fluyan las palabras y dile a esa persona cuánto significa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setView("create")}
                  className="btn-premium flex items-center justify-center gap-2 text-white py-4 px-10 rounded-2xl text-lg"
                >
                  <PenLine size={22} /> Escribir carta
                </button>
                <button
                  onClick={() => setView("history")}
                  className="flex items-center justify-center gap-2 glass-card text-gray-700 font-semibold py-4 px-10 rounded-2xl hover:shadow-lg transition-all active:scale-[0.98] text-lg"
                >
                  <History size={22} /> Mi archivo ({history.length})
                </button>
              </div>

              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-20 pt-16 border-t border-violet-200/50"
                >
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <Quote size={18} className="text-romantic-400" />
                    <h3 className="font-serif text-2xl heading-gradient">Últimas cartas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    {history.slice(0, 2).map((letter, i) => (
                      <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="glass-card rounded-3xl p-6 cursor-pointer group"
                        onClick={() => setView("history")}
                      >
                        <p className="text-romantic-600 font-medium text-sm mb-2">
                          Para {letter.recipientName}
                        </p>
                        <p className="text-gray-600 line-clamp-3 italic mb-4 font-serif text-lg leading-snug">
                          &ldquo;{letter.content}&rdquo;
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>{formatDate(letter)}</span>
                          <span className="bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-800 px-3 py-1 rounded-full font-medium">
                            {letter.style.split(" ")[0]}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="py-6"
            >
              <button
                onClick={() => {
                  setView("home");
                  setGeneratedLetter(null);
                }}
                className="mb-8 text-romantic-600 font-medium flex items-center gap-1 hover:text-romantic-700 transition-colors"
              >
                ← Volver
              </button>

              {!generatedLetter ? (
                <div className="glass-card rounded-[2rem] p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-gold-500" size={28} />
                    <h2 className="font-serif text-3xl font-semibold heading-gradient">Nueva carta</h2>
                  </div>
                  <p className="text-gray-500 mb-8">Cuéntanos tu historia; nosotros encontramos las palabras.</p>

                  <form onSubmit={handleGenerate} className="space-y-7">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ¿Para quién es?
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Mi madre, un viejo amigo, mi pareja..."
                        className="input-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vuestra historia
                      </label>
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Lo que quieras compartir: el silencio, los recuerdos, lo que sientes..."
                        rows={4}
                        maxLength={800}
                        className="input-premium resize-none"
                        required
                      />
                      <p className="text-right text-xs text-gray-400 mt-1">{context.length}/800</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tono de la carta
                      </label>
                      <StylePicker value={style} onChange={setStyle} />
                    </div>
                    <button
                      type="submit"
                      disabled={generating}
                      className="btn-premium w-full text-white font-bold py-5 rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-3"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="animate-spin" />
                          {LOADING_PHRASES[loadingPhrase]}
                        </>
                      ) : (
                        <>
                          <Send size={22} /> Generar mi carta
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="letter-paper rounded-[2rem] p-8 md:p-14 relative overflow-hidden"
                >
                  <div className="absolute top-6 right-6 md:top-10 md:right-10 opacity-[0.07] pointer-events-none">
                    <Heart size={160} fill="currentColor" className="text-romantic-600" />
                  </div>

                  <div className="relative z-10">
                    <p className="font-serif text-romantic-600 italic text-lg mb-1">Querido/a {recipient},</p>
                    <div className="font-serif text-xl md:text-2xl text-gray-800 leading-[1.75] whitespace-pre-wrap min-h-[120px]">
                      {typedLetter}
                      {!typewriterDone && (
                        <span className="inline-block w-0.5 h-6 bg-romantic-500 ml-0.5 animate-pulse align-middle" />
                      )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-romantic-200/50 flex flex-wrap gap-3">
                      <button
                        onClick={saveLetter}
                        className="btn-premium flex items-center gap-2 text-white py-3 px-6 rounded-xl"
                      >
                        <Heart size={18} /> Guardar
                      </button>
                      <button
                        onClick={() => copyToClipboard(generatedLetter)}
                        className="flex items-center gap-2 bg-white/90 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:shadow-md border border-violet-200/70 transition-all active:scale-[0.98]"
                      >
                        {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        {copied ? "Copiado" : "Copiar"}
                      </button>
                      <button
                        onClick={() => shareLetter(generatedLetter, recipient)}
                        className="flex items-center gap-2 bg-white/90 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:shadow-md border border-violet-200/70 transition-all active:scale-[0.98]"
                      >
                        <Share2 size={18} /> Compartir
                      </button>
                      <button
                        onClick={() => setGeneratedLetter(null)}
                        className="flex items-center gap-2 text-romantic-700 font-semibold py-3 px-6 rounded-xl hover:bg-romantic-100/50 transition-all"
                      >
                        <RefreshCw size={18} /> Otra versión
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex">
                    <div className="wax-seal w-14 h-14 rounded-full flex items-center justify-center">
                      <Heart size={22} className="text-white/90 fill-white/30" />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="py-6"
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setView("home")}
                  className="text-romantic-600 font-medium hover:text-romantic-700 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setView("create")}
                  className="btn-premium p-3 rounded-2xl text-white"
                  title="Nueva carta"
                >
                  <Plus size={24} />
                </button>
              </div>

              <h2 className="font-serif text-4xl font-semibold mb-2 heading-gradient">Tu archivo del corazón</h2>
              <p className="text-gray-500 mb-10">{history.length} carta{history.length !== 1 ? "s" : ""} guardada{history.length !== 1 ? "s" : ""}</p>

              {history.length === 0 ? (
                <div className="text-center py-24 glass-card rounded-[2rem] border-dashed border-2 border-violet-200/70">
                  <Moon size={52} className="mx-auto text-romantic-300 mb-5" />
                  <p className="text-gray-500 text-xl font-serif italic mb-6">
                    Tu archivo está vacío... por ahora.
                  </p>
                  <button
                    onClick={() => setView("create")}
                    className="btn-premium text-white py-3 px-8 rounded-xl"
                  >
                    Escribir la primera carta
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {history.map((letter, i) => (
                    <motion.div
                      layout
                      key={letter.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-3xl p-7 md:p-8 hover:shadow-xl transition-shadow duration-300 group"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <h3 className="font-serif text-2xl font-semibold heading-gradient">
                            Para {letter.recipientName}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{formatDate(letter)}</p>
                        </div>
                        <button
                          onClick={() => deleteLetter(letter.id)}
                          className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="bg-gradient-to-br from-violet-50/90 via-fuchsia-50/50 to-pink-50/80 p-6 rounded-2xl mb-5 font-serif text-lg leading-relaxed italic text-gray-700 whitespace-pre-wrap border border-violet-100/80">
                        {letter.content}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-800 bg-gradient-to-r from-violet-100 to-fuchsia-100 px-3 py-1.5 rounded-full">
                          {letter.style}
                        </span>
                        <div className="flex-1" />
                        <button
                          onClick={() => shareLetter(letter.content, letter.recipientName)}
                          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-romantic-600 p-2 rounded-lg hover:bg-romantic-50 transition-colors"
                        >
                          <Share2 size={16} /> Compartir
                        </button>
                        <button
                          onClick={() => copyToClipboard(letter.content, letter.id)}
                          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-romantic-600 p-2 rounded-lg hover:bg-romantic-50 transition-colors"
                        >
                          {copiedId === letter.id ? (
                            <>
                              <Check size={16} className="text-emerald-500" /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={16} /> Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center footer-gradient backdrop-blur-sm">
        <p className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent font-serif italic text-sm font-medium">
          &ldquo;Las palabras tienen el poder de cruzar cualquier distancia.&rdquo;
        </p>
        <p className="text-gray-400 text-xs mt-2 tracking-wide">Ecos del Corazón · Hecho con amor</p>
      </footer>
    </div>
  );
}
