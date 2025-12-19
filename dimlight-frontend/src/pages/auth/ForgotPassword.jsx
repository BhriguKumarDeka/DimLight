import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/api";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await API.post("/auth/forgot-password", { email });
      setStatus("success");
      toast.success("Recovery link sent to your email!");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">

       <div className="w-full max-w-2xl relative z-10 bg-surface border border-border rounded-2xl p-8 shadow-2xl">
          
          {status === "success" ? (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-text mb-2">Check your email</h2>
                <p className="text-textMuted mb-6">We sent a recovery link to <strong>{email}</strong>.</p>
                <Link to="/login" className="btn-secondary w-full py-2 rounded-xl">Return to Login</Link>
             </motion.div>
          ) : (
             <>
                <h1 className="text-2xl font-bold text-text mb-2">Reset Password</h1>
                <p className="text-textMuted text-sm mb-6">Enter your email to receive a secure link.</p>

                {status === "error" && (
                   <div className="p-3 bg-error/10 text-error text-xs rounded-lg mb-4">{errorMsg}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-textMuted w-4 h-4" />
                      <input 
                        type="email" 
                        required 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-text focus:ring-2 focus:ring-primary outline-none"
                      />
                   </div>
                   <button disabled={status === "loading"} className="w-full bg-text text-background py-3 rounded-xl font-bold hover:bg-text/80 transition-all disabled:opacity-50">
                      {status === "loading" ? "Sending..." : "Send Link"}
                   </button>
                </form>

                <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-textMuted hover:text-text transition-colors">
                   <ArrowLeft size={14} /> Back to Login
                </Link>
             </>
          )}
       </div>
    </div>
  );
}