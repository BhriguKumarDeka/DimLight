import { motion, AnimatePresence } from "motion/react";
import { X, Moon, Coffee, Activity, Smile, Clock } from "lucide-react";
import { zIndex } from "../lib/zIndex";

export default function DayDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 ${zIndex.modal} flex items-center justify-center p-4`}>

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${zIndex.modalBackdrop} bg-background/70 backdrop-blur-xs cursor-pointer`}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative ${zIndex.modalContent} w-full max-w-[450px] bg-background rounded-lg p-6 md:p-6 shadow-cardStrong overflow-hidden`}
        >

          {/* Header */}
          <div className="relative flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-normal text-primary">{log.date}</h2>
              <p className="text-xs text-textMuted font-mono mt-1">SLEEP LOG DETAILS</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-text/10 rounded-full transition-colors text-textMuted hover:text-text">
              <X size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative">
            <DetailItem
              icon={Clock}
              label="Duration"
              value={`${log.duration.toFixed(1)} hrs`}
              color="text-secondary"
              bg="bg-primary/10"
            />
            <DetailItem
              icon={Moon}
              label="Quality"
              value={`${log.sleepQuality}/5`}
              color="text-secondary"
              bg="bg-primary/10"
            />
            <DetailItem
              icon={Smile}
              label="Mood"
              value={log.mood || "—"}
              color="text-secondary"
              bg="bg-primary/10"
            />
            <DetailItem
              icon={Activity}
              label="Stress"
              value={`${log.stressLevel || 0}/5`}
              color="text-secondary"
              bg="bg-primary/10"
            />
          </div>

          {/* Caffeine */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface">
            <div className={`p-2 rounded-full ${log.caffeineIntake ? 'text-text' : 'text-textMuted'}`}>
              <Coffee size={24} />
            </div>
            <div>
              <span className="block text-xs text-textMuted uppercase tracking-wider">Late Caffeine</span>
              <span className="text-sm text-text font-medium">{log.caffeineIntake ? "Detected" : "None Recorded"}</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailItem({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-surface p-2 rounded-2xl flex gap-4">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-textMuted ">
        <Icon size={24} />
      </div>
      <div>
        <span className="text-[10px] text-textMuted uppercase tracking-wider block">{label}</span>
        <span className="text-md font-normal text-text">{value}</span>
      </div>
    </div>
  )
}