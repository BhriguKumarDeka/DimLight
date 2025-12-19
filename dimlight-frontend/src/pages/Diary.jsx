import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import API from "../api/api";
import {
   Smile, Hash, Loader2, CheckCircle2,
   ChevronRight, Calendar as CalendarIcon,
   MoreHorizontal
} from "lucide-react";

export default function Diary() {
   const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
   const [morningMood, setMorningMood] = useState("");
   const [notes, setNotes] = useState("");
   const [tags, setTags] = useState("");
   const [saveStatus, setSaveStatus] = useState("idle");
   const [recentEntries, setRecentEntries] = useState([]);

   // Load Data
   useEffect(() => {
      const loadEntry = async () => {
         try {
            setSaveStatus("idle");
            const res = await API.get(`/diary?date=${date}`);
            if (res.data.diary) {
               setMorningMood(res.data.diary.morningMood || "");
               setNotes(res.data.diary.notes || "");
               setTags((res.data.diary.tags || []).join(", "));
            } else {
               setMorningMood("");
               setNotes("");
               setTags("");
            }
         } catch (err) { console.error(err); }
      };

      const loadRecent = async () => {
         try {
            const res = await API.get("/diary/history?limit=15");
            setRecentEntries(res.data.entries || []);
         } catch (err) { console.error(err); }
      };

      loadEntry();
      loadRecent();
   }, [date]);

   // Auto-Save
   useEffect(() => {
      const saveData = async () => {
         setSaveStatus("saving");
         try {
            await API.post("/diary", {
               date, morningMood, notes,
               tags: tags.split(",").map((t) => t.trim()).filter(Boolean)
            });
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
         } catch (err) {
            setSaveStatus("error");
         }
      };

      const timeoutId = setTimeout(() => {
         if (notes || morningMood || tags) saveData();
      }, 1000);
      return () => clearTimeout(timeoutId);
   }, [morningMood, notes, tags, date]);

   return (
      <div className="h-[calc(100vh-80px)] w-full grid grid-cols-1 lg:grid-cols-12 border border-border rounded-lg overflow-hidden bg-linear-to-tr from-surface to-transparent">

         {/* Editor */}
         <div className="col-span-12 lg:col-span-9 h-full flex flex-col relative">

            {/* Header */}
            <div className="h-auto md:h-16 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-end px-4 md:px-8 py-3 md:py-0 shrink-0 relative z-10 bg-background/50 backdrop-blur-sm gap-3 md:gap-0">
               <div className="flex items-center gap-4 mr-auto">
                  <span className="text-2xl md:text-md font-light text-text">Personal Journal</span>
               </div>

               {/* Status */}
               <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-textMuted mr-3 md:mr-6">
                  {saveStatus === "saving" && <span className="animate-pulse flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Syncing...</span>}
                  {saveStatus === "saved" && <span className="text-primary flex items-center gap-1"><CheckCircle2 size={10} /> Saved</span>}
                  {saveStatus === "idle" && <span className="opacity-40 hidden md:block">Ready</span>}
               </div>

               {/* Gallery Link */}
               <Link to="/gallery" className="flex lg:hidden items-center gap-1 px-3 py-2 rounded text-[9px] text-textMuted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-colors uppercase tracking-wider font-medium">
                  Gallery <ChevronRight size={12} />
               </Link>

               {/* Date Picker */}
               <div className="flex items-center gap-2 text-textMuted hover:text-text transition-colors cursor-pointer group relative px-2 md:px-3 py-1 md:py-1.5 rounded hover:bg-surface border border-transparent hover:border-border">
                  <CalendarIcon size={12} md:size={14} />
                  <input
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="bg-transparent border-none text-xs md:text-sm font-mono outline-none cursor-pointer z-20 opacity-0 absolute inset-0 w-full"
                  />
                  <span className="text-xs md:text-sm font-mono uppercase tracking-wider">{dayjs(date).format("MMM DD")}</span>
               </div>
            </div>

            {/* Properties */}
            <div className="px-4 md:px-12 py-3 md:py-4 space-y-2 md:space-y-3 relative z-10 w-full">
               {/* Mood */}
               <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 group">
                  <div className="w-full md:w-24 flex items-center gap-2 text-textMuted text-xs md:text-sm font-medium">
                     <Smile size={14} />
                     <span>Mood</span>
                  </div>
                  <div className="flex gap-1.5 md:gap-2">
                     {["😃", "🙂", "😐", "😕", "😢"].map((emoji) => (
                        <button
                           key={emoji}
                           onClick={() => setMorningMood(emoji)}
                           className={`w-7 md:w-9 h-7 md:h-9 rounded-lg flex items-center justify-center text-lg md:text-xl transition-all ${morningMood === emoji
                              ? "scale-110 shadow-sm"
                              : "opacity-50 hover:opacity-100"
                              }`}
                        >
                           {emoji}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Tags */}
               <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 group">
                  <div className="w-full md:w-24 flex items-center gap-2 text-textMuted text-xs md:text-sm font-medium">
                     <Hash size={14} />
                     <span>Tags</span>
                  </div>
                  <input
                     type="text"
                     value={tags}
                     onChange={(e) => setTags(e.target.value)}
                     placeholder="Sleep, Dream, Anxiety..."
                     className="w-full md:flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-textMuted placeholder-textMuted/40 hover:bg-text/10 rounded px-2 py-1.5 md:-ml-2 transition-colors"
                  />
               </div>
            </div>

            {/* Writing */}
            <div className="flex-1 overflow-y-auto px-4 md:px-12 pb-8 md:pb-12 relative z-10 custom-scrollbar" data-lenis-prevent>
               <div className="w-full md:max-w-4xl md:mx-auto h-full min-h-[500px]">
                  <textarea
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     placeholder="Start writing..."
                     className="w-full h-full bg-transparent border-none outline-none resize-none text-base md:text-lg lg:text-xl leading-relaxed font-serif text-text placeholder-textMuted/20 selection:bg-primary/20 p-0"
                     spellCheck={false}
                  />
               </div>
            </div>
         </div>

         {/* History */}
         <div className="hidden lg:flex lg:col-span-3 h-full bg-surface/5 border-l border-border flex-col relative z-20">
            <div className="h-16 border-b border-border flex items-center justify-between px-5 shrink-0 bg-surface/50 backdrop-blur-md">
               <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                  <MoreHorizontal size={14} /> History
               </span>
               <Link to="/gallery" className="text-[10px] text-textMuted hover:text-text transition-colors uppercase tracking-wider flex items-center gap-1">
                  Full View <ChevronRight size={10} />
               </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar" data-lenis-prevent>
               {recentEntries.map((entry) => (
                  <div
                     key={entry._id}
                     onClick={() => setDate(entry.date)}
                     className={`group p-3 rounded-lg cursor-pointer transition-all border ${date === entry.date
                        ? "bg-surface border-border shadow-sm"
                        : "bg-transparent border-transparent hover:bg-surface/50 hover:border-border/50"
                        }`}
                  >
                     <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-mono transition-colors ${date === entry.date ? "text-primary" : "text-textMuted group-hover:text-text"}`}>
                           {dayjs(entry.date).format("MMM DD")}
                        </span>
                        <span className="text-base grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{entry.morningMood}</span>
                     </div>
                     <div className="text-[11px] text-textMuted/60 line-clamp-2 leading-relaxed font-serif pl-1 border-l-2 border-transparent group-hover:border-border transition-colors">
                        {entry.notes || "Empty entry..."}
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
   );
}