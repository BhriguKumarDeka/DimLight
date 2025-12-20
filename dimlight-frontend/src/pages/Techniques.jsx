import { useEffect, useState, memo } from "react";
import { showError } from "../utils/toastUtils";
import API from "../api/api";
import { Link } from "react-router-dom";
import { Wind, ArrowRight, Clock } from "lucide-react";

const TechniqueCard = memo(({ technique }) => (
  <Link key={technique._id} to={`/techniques/${technique._id}`} className="group block">
    <div className="bg-surface border border-surface/40 rounded-2xl p-4 h-full transition-all duration-300 hover:bg-transparent relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/60 text-[12px] font-mono text-textMuted">
          <Clock size={10} /> {technique.duration}m
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-md font-light mb-1 text-text group-hover:text-primary transition-colors">{technique.title}</h2>
        <p className="text-textMuted text-xs line-clamp-2 leading-relaxed mb-4">{technique.benefits?.[0] || "Relax and focus."}</p>
      </div>

      <div className="pt-4 border-t border-border flex justify-between items-center mt-auto">
        <span className="text-[10px] font-normal text-textMuted/60 uppercase tracking-widest">{technique.type}</span>
        <ArrowRight size={14} className="text-textMuted group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </Link>
));
TechniqueCard.displayName = 'TechniqueCard';

export default function Techniques() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/techniques");
        setTechniques(res.data.techniques);
      } catch (err) {
        showError("Failed to load techniques. Please try again.");
        console.error(err);
      }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="text-2xl font-light text-text tracking-tight">Techniques Library</h1>
        <p className="text-textMuted mt-2 text-sm">
          Scientifically proven protocols to modulate your nervous system. Select a session to begin.
        </p>
      </header>

      {loading ? (
        <div className="text-textMuted animate-pulse">Loading library...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techniques.map((technique) => (
            <TechniqueCard key={technique._id} technique={technique} />
          ))}
        </div>
      )}
    </div>
  );
}