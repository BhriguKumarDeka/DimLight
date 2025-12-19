import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { X, Moon, Coffee, Sun, ChevronDown, Activity, Heart } from "lucide-react";
import API from "../api/api";
import { useEffect } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zIndex } from "../lib/zIndex";

// DatePicker Styles
const datePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    background-color: rgb(var(--surface));
    border: 1px solid rgb(var(--border));
    color: rgb(var(--text));
    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.5);
    font-size: 0.8rem;
  }
  .react-datepicker__header { display: none; }
  .react-datepicker__time-container .react-datepicker__time {
    background-color: transparent;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
    padding: 6px 0;
    transition: all 0.1s;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
    background-color: rgba(var(--primary), 0.1);
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
    background-color: rgb(var(--primary)) !important;
    color: rgb(var(--background));
    font-weight: bold;
  }
  /* Ensure time list scrolls natively with Lenis excluded */
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
    max-height: 200px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--primary), 0.5) transparent;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list::-webkit-scrollbar {
    width: 8px;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list::-webkit-scrollbar-thumb {
    background: rgba(var(--primary), 0.5);
    border-radius: 6px;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list::-webkit-scrollbar-track {
    background: transparent;
  }
`;

// CompactTimeTrigger
const CompactTimeTrigger = ({ value, onClick, icon: Icon, label }) => (
  <div className="flex-1 group">
    <label className="text-[9px] font-bold text-textMuted uppercase tracking-wider mb-1.5 flex items-center gap-1">
      {Icon && <Icon size={10} />} {label}
    </label>
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border border-border bg-background/50 px-3 py-2.5 flex items-center justify-between hover:border-primary/50 hover:bg-background transition-all"
    >
      <span className={`text-xs font-mono font-medium ${value ? "text-text" : "text-textMuted"}`}>
        {value || "--:--"}
      </span>
      <ChevronDown size={14} className="text-textMuted opacity-50 group-hover:opacity-100" />
    </button>
  </div>
);

export default function LogSleepModal({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, reset, watch, setValue, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      bedTime: dayjs().hour(23).minute(0).toDate(),
      wakeTime: dayjs().hour(7).minute(0).toDate(),
      sleepQuality: 3,
      mood: "",
      stressLevel: 3,
      caffeineIntake: false,
      notes: "",
      tags: []
    }
  });

  const sleepQuality = watch("sleepQuality");
  const stressLevel = watch("stressLevel");
  const selectedMood = watch("mood");
  const caffeineIntake = watch("caffeineIntake");
  const tags = watch("tags");
  const notes = watch("notes");

  useEffect(() => {
    if (isOpen) {
      setValue("bedTime", dayjs().hour(23).minute(0).toDate());
      setValue("wakeTime", dayjs().hour(7).minute(0).toDate());
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data) => {
    try {
      const today = dayjs();
      const yesterday = dayjs().subtract(1, 'day');

      const wakeDate = dayjs(data.wakeTime);
      const finalWakeTime = today.hour(wakeDate.hour()).minute(wakeDate.minute()).second(0);

      const bedDate = dayjs(data.bedTime);
      let finalBedTime;
      if (bedDate.hour() >= 12) {
        finalBedTime = yesterday.hour(bedDate.hour()).minute(bedDate.minute()).second(0);
      } else {
        finalBedTime = today.hour(bedDate.hour()).minute(bedDate.minute()).second(0);
      }

      const payload = {
        ...data,
        bedTime: finalBedTime.toISOString(),
        wakeTime: finalWakeTime.toISOString()
      };

      await API.post("/sleep/log", payload);
      toast.success("Entry Saved");
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Sleep log error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Failed to save.";
      toast.error(errorMsg);
    }
  };

  const moods = [
    { emoji: "😢", label: "Bad" },
    { emoji: "😕", label: "Okay" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😃", label: "Great" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 ${zIndex.modal} flex items-center justify-center p-4`} data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch>
          <style>{datePickerStyles}</style>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 ${zIndex.modalBackdrop} bg-background/70 backdrop-blur-xs cursor-pointer`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative ${zIndex.modalContent} w-full max-w-3xl bg-surface border border-border rounded-3xl overflow-hidden shadow-cardStrong flex flex-col max-h-[85vh] md:max-h-[90vh]`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-background/50 shrink-0">
              <h2 className="text-sm font-bold text-text flex items-center gap-2 uppercase tracking-widest">
                <Moon size={14} className="text-primary" /> Log Sleep
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-full text-textMuted hover:text-text hover:bg-white/5"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row flex-1 overflow-hidden">

              {/* Metrics */}
              <div className="flex-1 p-6 space-y-6 border-b md:border-b-0 md:border-r border-border/50 overflow-y-auto md:overflow-visible">

                {/* Time */}
                <div className="flex gap-4">
                  <Controller
                    control={control}
                    name="bedTime"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        customInput={<CompactTimeTrigger icon={Moon} label="Bed Time" />}
                        popperClassName="z-[1000]"
                        shouldCloseOnScroll={false}
                        popperContainer={({ children }) => (
                          <div data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch>
                            {children}
                          </div>
                        )}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="wakeTime"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        customInput={<CompactTimeTrigger icon={Moon} label="Wake Time" />}
                        popperClassName="z-[1000]"
                        shouldCloseOnScroll={false}
                        popperContainer={({ children }) => (
                          <div data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch>
                            {children}
                          </div>
                        )}
                      />
                    )}
                  />
                </div>

                {/* Sliders */}
                <div className="space-y-5">
                  <div className="bg-background/30 p-4 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-textMuted uppercase flex items-center gap-1.5"><Moon size={12} /> Quality</span>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{sleepQuality}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" step="1"
                      {...register("sleepQuality")}
                      className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[9px] text-textMuted mt-2 opacity-60"><span>Restless</span><span>Deep</span></div>
                  </div>

                  <div className="bg-background/30 p-4 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-textMuted uppercase flex items-center gap-1.5"><Activity size={12} /> Stress</span>
                      <span className="text-xs font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded">{stressLevel}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" step="1"
                      {...register("stressLevel")}
                      className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-secondary"
                    />
                    <div className="flex justify-between text-[9px] text-textMuted mt-2 opacity-60"><span>Calm</span><span>Anxious</span></div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-3 block">Wake Up Mood</label>
                  <div className="grid grid-cols-5 gap-2">
                    {moods.map((m) => (
                      <label key={m.emoji} className="cursor-pointer group text-center">
                        <input type="radio" value={m.emoji} {...register("mood", { required: true })} className="hidden" />
                        <div className={`aspect-square flex items-center justify-center rounded-xl text-2xl transition-all duration-300 border ${selectedMood === m.emoji ? "bg-background border-primary shadow-glow scale-105" : "border-transparent hover:bg-background/50 grayscale hover:grayscale-0"}`}>
                          {m.emoji}
                        </div>
                        <span className={`text-[9px] mt-1 block transition-opacity ${selectedMood === m.emoji ? "opacity-100 text-text" : "opacity-0"}`}>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Context */}
              <div className="flex-1 p-6 flex flex-col justify-between space-y-6 bg-surface/30 overflow-y-auto md:overflow-visible">

                <div className="space-y-6">

                  {/* Factors */}
                  <div>
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-3 block">Daily Factors</label>
                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${caffeineIntake ? "bg-primary/10 border-primary/40" : "bg-background/30 border-border hover:border-border/80"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${caffeineIntake ? "bg-primary text-background" : "bg-surface text-textMuted"}`}>
                          <Coffee size={14} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${caffeineIntake ? "text-primary" : "text-text"}`}>Late Caffeine</div>
                          <div className="text-[10px] text-textMuted">After 2:00 PM</div>
                        </div>
                      </div>
                      {/* Toggle */}
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${caffeineIntake ? "bg-primary" : "bg-border"}`}>
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${caffeineIntake ? "translate-x-4" : ""}`} />
                      </div>
                      <input type="checkbox" {...register("caffeineIntake")} className="hidden" />
                    </label>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2 block">Sleep Notes <span className="text-[9px] font-normal text-textMuted/60">(Optional)</span></label>
                    <textarea
                      {...register("notes")}
                      placeholder="Add any notes about your sleep..."
                      className="w-full bg-background/30 border border-border rounded-xl p-3 text-xs text-text placeholder-textMuted/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none h-20 hover:border-border/80"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2 block">Tags <span className="text-[9px] font-normal text-textMuted/60">(Optional)</span></label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add tags (e.g., exercise, alcohol, travel)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value && !tags.includes(value)) {
                              setValue("tags", [...tags, value]);
                              e.target.value = "";
                            }
                          }
                        }}
                        className="w-full bg-background/30 border border-border rounded-xl px-3 py-2.5 text-xs text-text placeholder-textMuted/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-border/80"
                      />
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, idx) => (
                            <div key={idx} className="bg-primary/20 border border-primary/40 rounded-lg px-2 py-1 flex items-center gap-2 text-[10px] text-primary font-medium">
                              {tag}
                              <button
                                type="button"
                                onClick={() => setValue("tags", tags.filter((_, i) => i !== idx))}
                                className="hover:text-primary/70 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-text text-background font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-lg mt-auto"
                >
                  {isSubmitting ? "Syncing..." : "Save Entry"}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}