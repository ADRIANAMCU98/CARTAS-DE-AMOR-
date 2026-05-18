import { useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc
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
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Components ---

const Navbar = ({ user }: { user: User | null }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-romantic-100 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Heart className="text-romantic-500 fill-romantic-500" size={24} />
        <span className="font-serif text-xl font-bold tracking-tight text-gray-800">Ecos del Corazón</span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-romantic-200"
          />
          <button 
            onClick={logout}
            className="p-2 hover:bg-romantic-50 rounded-full transition-colors text-gray-600 hover:text-romantic-600"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-romantic-50">
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Heart className="text-romantic-500" size={64} fill="currentColor" />
    </motion.div>
  </div>
);

const LoginScreen = () => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-romantic-50">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-romantic-100 text-center"
    >
      <div className="mb-8 flex justify-center">
        <div className="bg-romantic-100 p-6 rounded-full">
          <MessageSquareHeart size={64} className="text-romantic-600" />
        </div>
      </div>
      <h1 className="font-serif text-4xl mb-4 font-bold text-gray-900">Cartas que Sanan</h1>
      <p className="text-gray-600 mb-10 leading-relaxed">
        Reconnect con tus seres queridos a través de palabras sinceras generadas con la ayuda de la inteligencia artificial.
      </p>
      <button 
        onClick={() => loginWithGoogle().catch(console.error)}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-2xl py-4 px-6 font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all active:scale-95"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/controller/google.svg" alt="Google" className="w-6 h-6" />
        Entrar con Google
      </button>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"home" | "create" | "history">("home");
  const [history, setHistory] = useState<Letter[]>([]);
  
  // Generation State
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [style, setStyle] = useState("Romántico y Nostálgico");
  const [generating, setGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const letters = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Letter));
      setHistory(letters);
    }, (error) => {
      console.error("Firestore error:", error);
    });
    return unsubscribe;
  }, [user]);

  const handleGenerate = async (e: any) => {
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
      }
    } catch (error) {
      console.error("Generation failed:", error);
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
        updatedAt: serverTimestamp()
      });
      setGeneratedLetter(null);
      setRecipient("");
      setContext("");
      setView("history");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteLetter = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "letters", id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar user={user} />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 text-center"
            >
              <h2 className="font-serif text-5xl font-bold mb-6 text-gray-900">Recupera los lazos perdidos</h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                A veces, el silencio dura demasiado. Deja que las palabras vuelvan a fluir y dile a esa persona especial cuánto la extrañas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setView("create")}
                  className="flex items-center justify-center gap-2 bg-romantic-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:bg-romantic-600 transition-all active:scale-95 text-lg"
                >
                  <Plus size={24} /> Nueva Carta
                </button>
                <button 
                  onClick={() => setView("history")}
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-romantic-200 font-semibold py-4 px-8 rounded-2xl hover:bg-romantic-50 transition-all active:scale-95 text-lg"
                >
                  <History size={24} /> Ver Historial
                </button>
              </div>

              {history.length > 0 && (
                <div className="mt-20 py-12 border-t border-romantic-100">
                  <h3 className="font-serif text-2xl font-semibold mb-8 text-gray-800">Tus últimas palabras guardadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {history.slice(0, 2).map((letter) => (
                      <div key={letter.id} className="bg-white p-6 rounded-3xl border border-romantic-100 shadow-sm">
                        <p className="text-romantic-500 font-medium text-sm mb-2">Para: {letter.recipientName}</p>
                        <p className="text-gray-600 line-clamp-3 italic mb-4 font-serif text-lg leading-snug">"{letter.content}"</p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>{letter.createdAt ? new Date(letter.createdAt.seconds * 1000).toLocaleDateString() : 'Reciente'}</span>
                          <span className="bg-romantic-50 text-romantic-600 px-2 py-1 rounded-full">{letter.style}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === "create" && (
            <motion.div 
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-8"
            >
              <button 
                onClick={() => { setView("home"); setGeneratedLetter(null); }}
                className="mb-8 text-romantic-600 font-medium flex items-center gap-1 hover:underline"
              >
                ← Volver al inicio
              </button>
              
              {!generatedLetter ? (
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-romantic-100">
                  <h2 className="font-serif text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                    <Sparkles className="text-romantic-500" /> Crear nueva carta
                  </h2>
                  <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">¿Para quién es la carta?</label>
                      <input 
                        type="text" 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Ej: Mi madre, un viejo amigo, mi hermana..."
                        className="w-full bg-romantic-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-romantic-400 focus:bg-white transition-all outline-none text-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cuéntanos un poco sobre vuestra historia</label>
                      <textarea 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Ej: No hablamos desde la discusión en Navidad hace 3 años. Quiero decirle que la echo de menos y que la familia no es lo mismo sin ella."
                        rows={4}
                        className="w-full bg-romantic-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-romantic-400 focus:bg-white transition-all outline-none text-lg resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tono de la carta</label>
                      <select 
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full bg-romantic-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-romantic-400 focus:bg-white transition-all outline-none text-lg appearance-none cursor-pointer"
                      >
                        <option>Romántico y Nostálgico</option>
                        <option>Directo y Sincero</option>
                        <option>Divertido y Ligero</option>
                        <option>Formal y Respetuoso</option>
                        <option>Poético y Profundo</option>
                      </select>
                    </div>
                    <button 
                      type="submit"
                      disabled={generating}
                      className="w-full bg-romantic-500 text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-romantic-600 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-3"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="animate-spin" /> Escogiendo las palabras correctas...
                        </>
                      ) : (
                        <>
                          <Send size={24} /> Generar Carta
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-romantic-100 rounded-3xl p-8 md:p-12 shadow-inner border border-romantic-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Heart size={200} fill="currentColor" className="text-romantic-500" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-serif text-gray-500 italic text-lg mb-4">Para: {recipient}</h3>
                    <div className="font-serif text-2xl text-gray-800 leading-relaxed space-y-6 whitespace-pre-wrap">
                      {generatedLetter}
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-romantic-200 flex flex-wrap gap-4">
                      <button 
                        onClick={saveLetter}
                        className="flex items-center gap-2 bg-romantic-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-romantic-700 transition-all shadow-md active:scale-95"
                      >
                        <Heart size={20} /> Guardar Carta
                      </button>
                      <button 
                        onClick={() => copyToClipboard(generatedLetter)}
                        className="flex items-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all border border-romantic-300 active:scale-95"
                      >
                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        {copied ? "¡Copiado!" : "Copiar Texto"}
                      </button>
                      <button 
                        onClick={() => setGeneratedLetter(null)}
                        className="flex items-center gap-2 bg-transparent text-romantic-700 font-semibold py-3 px-6 rounded-xl hover:bg-romantic-200/50 transition-all active:scale-95"
                      >
                        <RefreshCw size={20} /> Intentar de nuevo
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "history" && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-8"
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setView("home")}
                  className="text-romantic-600 font-medium flex items-center gap-1 hover:underline"
                >
                  ← Volver al inicio
                </button>
                <button 
                  onClick={() => setView("create")}
                  className="bg-romantic-500 text-white p-3 rounded-2xl hover:bg-romantic-600 transition-all shadow-md active:scale-95"
                  title="Nueva carta"
                >
                  <Plus size={24} />
                </button>
              </div>

              <h2 className="font-serif text-4xl font-bold mb-10 text-gray-900 border-b-2 border-romantic-100 pb-4">Tu Historial de Sentimientos</h2>

              {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-romantic-300">
                  <Moon size={48} className="mx-auto text-romantic-200 mb-4" />
                  <p className="text-gray-500 text-xl font-serif italic">Aún no has escrito ninguna carta.</p>
                  <button 
                    onClick={() => setView("create")}
                    className="mt-6 text-romantic-600 font-bold hover:underline"
                  >
                    Escribe tu primera carta hoy
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {history.map((letter) => (
                    <motion.div 
                      layout
                      key={letter.id} 
                      className="bg-white rounded-3xl p-8 shadow-sm border border-romantic-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-gray-900">Para: {letter.recipientName}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {letter.createdAt ? new Date(letter.createdAt.seconds * 1000).toLocaleDateString("es-ES", {
                              day: 'numeric', month: 'long', year: 'numeric'
                            }) : "Reciente"}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteLetter(letter.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Eliminar carta"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="bg-romantic-50/50 p-6 rounded-2xl mb-6 font-serif text-lg leading-relaxed italic text-gray-700 whitespace-pre-wrap">
                        {letter.content}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-romantic-500 bg-romantic-100 px-3 py-1 rounded-full">
                          {letter.style}
                        </span>
                        <div className="flex-1"></div>
                        <button 
                          onClick={() => copyToClipboard(letter.content, letter.id)}
                          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-romantic-600 transition-colors"
                        >
                          {copiedId === letter.id ? (
                            <>
                              <Check size={16} className="text-green-500" /> Copiado
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

      <footer className="py-10 text-center border-t border-romantic-100 bg-white/50">
        <p className="text-romantic-300 font-serif italic text-sm">
          "Las palabras tienen el poder de cruzar cualquier distancia."
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Hecho con amor y tecnología para reconectar corazones.
        </p>
      </footer>
    </div>
  );
}
