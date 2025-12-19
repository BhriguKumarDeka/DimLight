import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/api";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setStatus("loading");
    try {
      await API.put(`/auth/reset-password/${token}`, { password: pass });
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password";
      toast.error(msg);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
       <div className="max-w-2xl bg-surface border border-border rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-extralight text-text mb-6">Set New Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-textMuted w-4 h-4" />
                <input type="password" required placeholder="New Password" value={pass} onChange={e=>setPass(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-text focus:ring-2 focus:ring-primary outline-none"/>
             </div>
             <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-textMuted w-4 h-4" />
                <input type="password" required placeholder="Confirm Password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-text focus:ring-2 focus:ring-primary outline-none"/>
             </div>
             <button disabled={status === "loading"} className="w-full bg-text text-background py-3 rounded-xl font-bold hover:bg-text/80 transition-all disabled:opacity-50">
                {status === "loading" ? "Updating..." : "Update Password"}
             </button>
          </form>
       </div>
    </div>
  );
}