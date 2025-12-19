import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/api";
import { Moon, ArrowRight, User, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { calculatePasswordStrength, normalizeApiError } from "../../lib/utils";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      // Client-side policy guard to avoid backend 400 (8+ chars, upper/lower/number/symbol)
      const meetsPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
      if (!meetsPolicy) {
        const msg = "Use 8+ chars with upper/lower, a number, and a symbol";
        setError(msg);
        toast.error(msg);
        return;
      }

      const res = await API.post("/auth/signup", { name, email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const { message, type } = normalizeApiError(err);
      setError(message);
      if (type === "warning") {
        toast(message, { id: "warn", icon: "⚠️", duration: 4000 });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const strengthColor = strength.score >= 80 ? "bg-primary" : strength.score >= 60 ? "bg-secondary" : strength.score >= 40 ? "bg-amber-500" : "bg-red-500";
  const strengthText = strength.score >= 80 ? "text-primary" : strength.score >= 60 ? "text-secondary" : strength.score >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 relative">
      {/* Card */}
      <div className="w-full max-w-5xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Left Column */}
        <div className="relative hidden lg:block bg-black overflow-hidden group">
          {/* Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-150 object-cover opacity-90 group-hover:scale-105 transition-transform duration-[20s] ease-linear"
          >
            <source src="/sleep.mp4" type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent flex flex-col justify-end  p-10">
            <h2 className="text-xl font-extralight text-white leading-tight">
              DimLight and Remi welcomes you to a journey of better sleep and self-discovery.
            </h2>
          </div>
        </div>

        {/* Signup Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative bg-surface/50 backdrop-blur-md">
          <Link to="/" className="absolute top-8 left-8 text-textMuted hover:text-text transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Home
          </Link>

          <div className="w-full mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-text">Create Account</h1>
              <p className="text-textMuted text-sm mt-2"> Fill in your details to get started. </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Password Warning */}
            {password && strength.score < 60 && (
              <div className="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20 text-text text-xs">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle size={16} className="text-primary" />
                  Password strength: <span className={`ml-1 ${strengthText}`}>{strength.label}</span>
                </div>
                {strength.suggestions?.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-textMuted">
                    {strength.suggestions.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input
                    className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-text text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-textMuted/50 hover:border-textMuted/50"
                    placeholder="Alex Dreamer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input
                    className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-text text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-textMuted/50 hover:border-textMuted/50"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input
                    className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-10 py-3 text-text text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-textMuted/50 hover:border-textMuted/50"
                    type={showPassword ? "text" : "password"}
                    placeholder="•••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength Meter */}
                <div className="mt-3 ml-1">
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${strengthColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${strength.score}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] font-medium flex items-center gap-2">
                    <span className="text-textMuted">Strength:</span>
                    <span className={`${strengthText}`}>{strength.label}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-text text-background py-3.5 rounded-xl font-bold hover:bg-text/90 transition-all shadow-lg shadow-primary/10 mt-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-textMuted">
              Already have an account? <Link to="/login" className="text-text font-semibold hover:underline decoration-primary underline-offset-4">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}