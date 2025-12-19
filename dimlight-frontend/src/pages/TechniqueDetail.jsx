import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import { ChevronRight, Home, Wind, ShieldCheck, CheckCircle2, List } from "lucide-react";
import { motion } from "motion/react";
import BreathingVisualizer from "../components/BreathingVisualizer";

export default function TechniqueDetail() {
   const { id } = useParams();
   const [technique, setTechnique] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeStep, setActiveStep] = useState(0);

   useEffect(() => {
      const loadTechnique = async () => {
         try {
            const res = await API.get(`/techniques/${id}`);
            setTechnique(res.data.technique);
            if (!res.data.technique) {
               toast.error("Technique not found.");
            }
         } catch (err) {
            toast.error("Failed to load technique.");
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      loadTechnique();
   }, [id]);

   // Sequence parsing
   const sequence = useMemo(() => {
      if (!technique?.steps) return [];

      return technique.steps.map((stepText) => {
         const lower = stepText.toLowerCase();
         let mode = "idle";
         let label = "Prepare";
         let duration = 4000;

         if (lower.includes("inhale") || lower.includes("breathe in")) {
            mode = "inhale";
            label = "Inhale";
         } else if (lower.includes("exhale") || lower.includes("breathe out")) {
            mode = "exhale";
            label = "Exhale";
         } else if (lower.includes("hold")) {
            mode = "hold";
            label = "Hold";
         }

         const numberMatch = stepText.match(/(\d+)\s*(?:s|sec|second)?/);
         if (numberMatch) {
            const val = parseInt(numberMatch[1], 10);
            duration = val < 100 ? val * 1000 : val;
         }

         return { label, mode, duration, originalText: stepText };
      });
   }, [technique]);

   if (loading) return (
      <div className="flex h-[80vh] items-center justify-center text-textMuted animate-pulse text-sm uppercase tracking-widest">
         Loading Session...
      </div>
   );

   if (!technique) return <div className="text-textMuted text-center mt-20">Technique not found</div>;

   return (
      // Main Container: Fixed height to fit viewport (adjust 80px based on your navbar height)
      <div className="max-w-7xl mx-auto px-6 py-6 h-[calc(100vh-80px)] flex flex-col gap-6">

         {/* Top Header Row: Compact to save vertical space */}
         <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-2">
               {/* Breadcrumbs */}
               <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-textMuted">
                  <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                     <Home size={10} /> Home
                  </Link>
                  <ChevronRight size={10} className="opacity-50" />
                  <Link to="/techniques" className="hover:text-primary transition-colors flex items-center gap-1">
                     <Wind size={10} /> Library
                  </Link>
                  <ChevronRight size={10} className="opacity-50" />
                  <span className="text-text line-clamp-1 max-w-[150px]">{technique.title}</span>
               </nav>

               {/* Title & Desc */}
               <div className="flex items-baseline gap-4">
                  <h1 className="text-2xl font-light text-text tracking-tight">{technique.title}</h1>
                  <span className="hidden md:inline text-sm text-textMuted font-light border-l border-border pl-4">
                     Follow the visualizer to relax your nervous system.
                  </span>
               </div>
            </div>

            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest self-start md:self-center">
               {technique.type}
            </div>
         </div>

         {/* Main Content Grid: Fills remaining height */}
         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

            {/* LEFT COLUMN: Visualizer (Dominant) */}
            <div className="lg:col-span-8 flex flex-col h-full">
               <div className="flex-1 rounded-xl bg-surface overflow-hidden shadow-card flex flex-col justify-center relative">
                  <BreathingVisualizer
                     sequence={sequence}
                     onStepChange={(index) => setActiveStep(index)}
                  />
               </div>
            </div>

            {/* RIGHT COLUMN: Sidebar (Steps + Info) */}
            <div className="lg:col-span-4 flex flex-col gap-4 h-full min-h-0">

               <div className="flex-1 flex flex-col bg-surface/20 border border-border rounded-xl overflow-hidden min-h-0">
                  <div className="shrink-0 p-3 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center gap-2">
                     <List size={14} className="text-textMuted" />
                     <h3 className="text-[10px] font-bold text-text uppercase tracking-widest">Sequence Steps</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                     {(technique.steps || []).map((step, i) => (
                        <motion.div
                           key={i}
                           animate={{
                              opacity: i === activeStep ? 1 : 0.5,
                              scale: i === activeStep ? 1 : 0.98,
                           }}
                           className={`p-3 rounded-lg border transition-all duration-300 ${i === activeStep
                                 ? "bg-surface border-primary/30 shadow-sm"
                                 : "bg-transparent border-transparent hover:bg-surface/30"
                              }`}
                        >
                           <div className="flex gap-3 items-start">
                              <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-colors duration-300 ${i === activeStep
                                    ? "bg-primary text-background border-primary"
                                    : "bg-surface text-textMuted border-border"
                                 }`}>
                                 {i + 1}
                              </div>
                              <p className={`text-xs leading-relaxed ${i === activeStep ? "text-text" : "text-textMuted"}`}>
                                 {step}
                              </p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>

               <div className="shrink-0 bg-surface/30 border border-border rounded-xl p-4 backdrop-blur-sm max-h-[35%] overflow-y-auto custom-scrollbar">
                  <h3 className="text-[10px] font-bold text-text uppercase tracking-widest mb-3 flex items-center gap-2">
                     <ShieldCheck size={12} className="text-primary" /> Benefits
                  </h3>
                  <ul className="space-y-2 mb-4">
                     {(technique.benefits || []).slice(0, 3).map((b, i) => (
                        <li key={i} className="flex gap-2 text-xs text-textMuted leading-relaxed">
                           <CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" />
                           {b}
                        </li>
                     ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                     {["High Stress", "Insomnia"].map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded bg-surface border border-border text-[9px] font-medium text-textMuted">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}