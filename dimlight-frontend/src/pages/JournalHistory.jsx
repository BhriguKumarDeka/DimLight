import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import { Search, X, ChevronRight, Home, BookOpen } from "lucide-react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

// Modal
const JournalModal = ({ entry, onClose }) => {
   return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

         {/* Backdrop */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
         />

         {/* Card */}
         <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl overflow-hidden shadow-cardStrong flex flex-col max-h-[85vh] z-10"
         >
            {/* Header */}
            <div className="p-6 pb-4 flex justify-between items-start border-b border-border bg-background/50">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-3xl">{entry.morningMood}</span>
                     <div className="px-3 py-1 rounded-full border border-border bg-background/50 text-xs font-mono text-textMuted">
                        {dayjs(entry.date).format("dddd, MMMM D, YYYY")}
                     </div>
                  </div>
                  <div className="flex gap-2">
                     {entry.tags?.map((t, i) => <span key={i} className="text-xs text-primary">#{t}</span>)}
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-text/5 rounded-full transition-colors text-textMuted hover:text-text"><X size={20} /></button>
            </div>

            {/* Content */}
            <div
               className="p-8 overflow-y-auto font-serif text-lg leading-loose text-text/90 whitespace-pre-wrap overscroll-contain"
               data-lenis-prevent
            >
               {entry.notes}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-background/30 flex justify-end">
               <button onClick={() => {
                  window.location.href = `/diary?date=${entry.date}`;
               }} className="text-xs font-bold text-textMuted hover:text-text transition-colors uppercase tracking-widest">
                  Edit Entry
               </button>
            </div>
         </motion.div>
      </div>
   );
};

export default function JournalGallery() {
   const navigate = useNavigate();
   const [entries, setEntries] = useState([]);
   const [recentEntries, setRecentEntries] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedEntry, setSelectedEntry] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
      const load = async () => {
         try {
            const res = await API.get("/diary/history");
            setEntries(res.data.entries || []);
            const recentRes = await API.get("/diary/history?limit=15");
            setRecentEntries(recentRes.data.entries || []);
         } catch (err) {
            toast.error("Failed to load journal history.");
            console.error(err);
         }
         finally { setLoading(false); }
      };
      load();
   }, []);

   const filteredEntries = entries.filter(e =>
      e.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.morningMood?.includes(searchTerm)
   );

   return (
      <div className="flex h-full w-full gap-6 relative">
         {/* Main */}
         <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0" data-lenis-prevent>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 p-6 sm:p-0 sm:pb-6 shrink-0 border-b border-border/50">

               {/* Breadcrumbs */}
               <div className="flex flex-col gap-2">
                  <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-textMuted">
                     <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                        <Home size={10} /> Home
                     </Link>
                     <ChevronRight size={10} className="opacity-50" />
                     <Link to="/diary" className="hover:text-primary transition-colors flex items-center gap-1">
                        <BookOpen size={10} /> Diary
                     </Link>
                     <ChevronRight size={10} className="opacity-50" />
                     <span className="text-text">History</span>
                  </nav>
                  <h1 className="text-2xl font-light tracking-tight text-text">Journal Gallery</h1>
               </div>

               {/* Search */}
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
                  <input
                     type="text"
                     placeholder="Search memories..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-surface border border-border rounded-full pl-10 pr-4 py-2 text-sm text-text focus:ring-1 focus:ring-primary outline-none transition-all placeholder-textMuted"
                  />
               </div>
            </div>

            {/* Grid */}
            {loading ? (
               <div className="text-center py-20 text-textMuted animate-pulse">Curating your memories...</div>
            ) : filteredEntries.length === 0 ? (
               <div className="text-center py-20 border border-dashed border-border rounded-3xl text-textMuted bg-surface">
                  No entries match {searchTerm}.
               </div>
            ) : (
               <div className="columns-1 md:columns-2 gap-6 space-y-6 pr-6 pb-20">
                  {filteredEntries.map((entry) => (
                     <div
                        key={entry._id}
                        onClick={() => setSelectedEntry(entry)}
                        className="break-inside-avoid bg-surface border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/40 hover:shadow-cardStrong transition-all duration-300 group"
                     >
                        <div className="flex justify-between items-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                           <span className="text-xs font-mono text-textMuted">{dayjs(entry.date).format("MMM DD")}</span>
                           <span className="text-xl">{entry.morningMood}</span>
                        </div>
                        <p className="text-text/80 font-serif leading-relaxed line-clamp-6 mb-4 text-[15px]">{entry.notes}</p>
                        <div className="flex flex-wrap gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                           {entry.tags?.map((t, i) => <span key={i} className="text-[10px] text-primary">#{t}</span>)}
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Sidebar */}
         <div className="hidden lg:flex lg:w-64 h-full bg-surface/5 border-l border-border flex-col relative z-20 shrink-0">
            <div className="h-24 border-b border-border flex items-end px-5 pb-4 shrink-0 bg-surface/50 backdrop-blur-md">
               <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Recent Entries</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar" data-lenis-prevent>
               {recentEntries.map((entry) => (
                  <button
                     key={entry._id}
                     onClick={() => setSelectedEntry(entry)}
                     className="w-full text-left p-3 rounded-lg bg-surface/30 hover:bg-surface/60 border border-transparent hover:border-border transition-all group"
                  >
                     <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-mono text-textMuted">{dayjs(entry.date).format("MMM DD")}</span>
                        <span className="text-sm">{entry.morningMood}</span>
                     </div>
                     <p className="text-xs text-text/70 line-clamp-2 leading-tight">{entry.notes}</p>
                  </button>
               ))}
            </div>
         </div>

         {/* Modal */}
         <AnimatePresence>
            {selectedEntry && (
               <JournalModal
                  key="modal"
                  entry={selectedEntry}
                  onClose={() => setSelectedEntry(null)}
               />
            )}
         </AnimatePresence>
      </div>
   );
}