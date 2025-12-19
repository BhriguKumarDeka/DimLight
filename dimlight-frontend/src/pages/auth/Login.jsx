import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import Typewriter from "typewriter-effect"; // ✅ IMPORTED LIBRARY
import API from "../../api/api";
import { normalizeApiError } from "../../lib/utils";
import { AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

// LoginStarBackground
const LoginStarBackground = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    const starCount = 150;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      blinkDuration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const newStar = {
        id,
        x: Math.random() * 60 + 20,
        y: Math.random() * 40,
        scale: Math.random() * 0.5 + 0.5
      };
      setShootingStars(prev => [...prev, newStar]);
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, 1500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-background">
      <div className="absolute inset-0 " />
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [star.opacity, 1, star.opacity] }}
          transition={{ duration: star.blinkDuration, repeat: Infinity, ease: "easeInOut", delay: star.delay }}
        />
      ))}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute h-px bg-linear-to-r from-transparent via-primary to-transparent"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${80 * star.scale}px`,
            transform: 'rotate(-45deg)',
            animation: 'shoot 1.2s linear forwards',
            opacity: 0.8,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
          }}
        />
      ))}
      <style>{`
        @keyframes shoot {
            0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateX(-200px) translateY(200px) rotate(-45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// TypewriterMessage
const TypewriterMessage = ({ isPasswordFocused }) => {
  const typewriterRef = useRef(null);
  useEffect(() => {
    if (!typewriterRef.current) return;

    if (isPasswordFocused) {
      typewriterRef.current
        .stop()
        .deleteAll(40)
        .typeString("I won't peek, I promise")
        .start();
    } else {
      typewriterRef.current
        .stop()
        .deleteAll(40)
        .typeString("Good to see you again!")
        .start();
    }
  }, [isPasswordFocused]);

  return (
    <div className="absolute -top-10 right-30 z-20 pointer-events-none min-h-10 flex items-end justify-end">
      <div className="">
        <Typewriter
          onInit={(typewriter) => {
            typewriterRef.current = typewriter;
            typewriter.typeString('Good to see you again!').start();
          }}
          options={{
            delay: 50,       // Typing speed
          }}
        />
      </div>
    </div>
  );
};

// Login
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for Mascot Reaction
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful! Welcome back.");
      navigate("/dashboard");
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

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 lg:p-0 relative">

      {/* Card */}
      <div className="w-full max-w-5xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Left Column */}
        <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden border-r border-border">

          <LoginStarBackground />

          <div className="relative z-10 w-112 h-72 flex items-center justify-center">

            {/* Typewriter */}
            <TypewriterMessage isPasswordFocused={isPasswordFocused} />

            {/* Mascot Images */}
            <motion.img
              src="/remi-hi.png"
              alt="Mascot Idle"
              className="absolute w-full h-full object-contain "
              initial={{ opacity: 1 }}
              animate={{ opacity: isPasswordFocused ? 0 : 1 }}
              transition={{ duration: 0 }}
            />
            <motion.img
              src="/remi-shy.png"
              alt="Mascot Hiding"
              className="absolute w-full h-full object-contain shadow-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPasswordFocused ? 1 : 0 }}
              transition={{ duration: 0 }}
            />
          </div>

          <div className="relative z-10 mt-8 text-center px-8">
            <p className="text-textMuted text-sm font-light italic">
              Remi awaits your return to the stars.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative bg-surface/50 backdrop-blur-md">

          <Link to="/" className="absolute top-8 left-8 text-textMuted hover:text-text transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Home
          </Link>

          <div className="w-full mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-text">Welcome Back</h1>
              <p className="text-textMuted text-sm mt-2">Let’s continue your sleep journey</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2 text-error text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Email</label>
                <input
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-textMuted/50"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <input
                    className="w-full bg-background/50 border border-border rounded-xl px-4 pr-10 py-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-textMuted/50"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
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
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-secondary transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-text text-background py-3.5 rounded-xl font-bold hover:bg-text/90 transition-all shadow-lg shadow-primary/10 mt-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-textMuted">
              New to DimLight? <Link to="/signup" className="text-text font-semibold hover:underline decoration-primary underline-offset-4">Create account</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}