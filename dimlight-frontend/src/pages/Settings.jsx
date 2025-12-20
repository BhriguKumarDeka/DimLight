import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { showSuccess, showError } from "../utils/toastUtils";
import { hardwareService } from "../api/api";
import { User, Bell, Shield, LogOut, ChevronRight, Moon, Watch, Activity, Egg, Check, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
   const [searchParams, setSearchParams] = useSearchParams();

   const [notifications, setNotifications] = useState(true);
   const [emailDigest, setEmailDigest] = useState(false);

   // Loading states
   const [isConnecting, setIsConnecting] = useState(false);
   const [isSyncing, setIsSyncing] = useState(false);

   // Device State
   const [connectedDevices, setConnectedDevices] = useState({
      googleFit: false,
      oura: false,
      fitbit: false
   });

   const user = JSON.parse(localStorage.getItem("user") || "{}");
   const firstName = user.name ? user.name.split(" ")[0] : "Dreamer";

   // 1. Check for Return Status from Google
   useEffect(() => {
      const status = searchParams.get('status');

      if (status === 'google_success') {
         setConnectedDevices(prev => ({ ...prev, googleFit: true }));
         toast.success("Google Fit Connected Successfully!");

         // Clean up URL (remove ?status=...)
         window.history.replaceState({}, document.title, "/settings");
      }
      else if (status === 'error') {
         toast.error("Connection Failed. Please try again.");
      }
   }, [searchParams]);

   // 2. Handle Connect Click
   const handleGoogleConnect = async () => {
      setIsConnecting(true);
      try {
         // Get the Google URL from our backend
         const res = await hardwareService.getGoogleAuthUrl();
         // Redirect the user to Google
         window.location.href = res.data.url;
      } catch (err) {
         console.error(err);
         toast.error("Failed to initialize connection");
         setIsConnecting(false);
      }
   };

   // 3. Handle Manual Sync (Optional Feature)
   const handleSync = async () => {
      if (!connectedDevices.googleFit) return;
      setIsSyncing(true);
      try {
         const res = await hardwareService.syncGoogleData();
         showSuccess(`Synced ${res.data.count} new sleep logs!`);
      } catch (err) {
         showError("Sync failed. Try reconnecting.");
      } finally {
         setIsSyncing(false);
      }
   };

   return (
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
         <div>
            <h1 className="text-3xl font-bold text-text">Settings</h1>
            <p className="text-textMuted mt-1">Manage your account and preferences.</p>
         </div>

         {/* Integrations */}
         <section className="space-y-4">
            <h2 className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Integrations</h2>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">

               {/* Google Fit */}
               <div className="p-4 flex items-center justify-between border-b border-border bg-surface/50">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${connectedDevices.googleFit ? 'bg-blue-500/10 text-blue-500' : 'bg-background text-textMuted'}`}>
                        <Activity size={18} />
                     </div>
                     <div>
                        <div className="text-sm font-medium text-text">Google Fit</div>
                        <div className="text-xs text-textMuted">Import activity & heart rate</div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     {/* Sync */}
                     {connectedDevices.googleFit && (
                        <button
                           onClick={handleSync}
                           disabled={isSyncing}
                           className="p-2 rounded-full hover:bg-background text-textMuted hover:text-primary transition-colors disabled:animate-spin"
                           title="Sync Now"
                        >
                           <RefreshCw size={14} />
                        </button>
                     )}

                     <button
                        onClick={handleGoogleConnect}
                        disabled={connectedDevices.googleFit || isConnecting}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${connectedDevices.googleFit
                           ? "bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-default"
                           : "bg-text text-background border-transparent hover:bg-text/90"
                           }`}
                     >
                        {isConnecting ? "..." : connectedDevices.googleFit ? <><Check size={12} /> Connected</> : "Connect"}
                     </button>
                  </div>
               </div>

               {/* Fitbit */}
               <div className="p-4 flex items-center justify-between hover:bg-text/5 transition-colors opacity-60">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-background text-textMuted">
                        <Watch size={18} />
                     </div>
                     <div>
                        <div className="text-sm font-medium text-text">Fitbit</div>
                        <div className="text-xs text-textMuted">Coming Soon</div>
                     </div>
                  </div>
                  <button disabled className="px-4 py-1.5 rounded-full text-xs font-bold bg-surface text-textMuted border border-border cursor-not-allowed">
                     Connect
                  </button>
               </div>

            </div>

            <p className="text-[10px] text-textMuted pl-2">
               * To sync data, please ensure you have <strong>Google Fit</strong> installed on your mobile device.
            </p>
         </section>

         {/* Preferences */}
         <section className="space-y-4">
            <h2 className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Preferences</h2>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
               <div className="p-4 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-lg text-primary"><Bell size={18} /></div>
                     <div>
                        <div className="text-sm font-medium text-text">Push Notifications</div>
                        <div className="text-xs text-textMuted">Receive daily sleep reminders</div>
                     </div>
                  </div>
                  <button
                     role="switch"
                     aria-checked={notifications}
                     onClick={() => setNotifications(!notifications)}
                     className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary ${notifications ? 'bg-primary' : 'bg-background border border-border'}`}
                  >
                     <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </div>

               <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Moon size={18} /></div>
                     <div>
                        <div className="text-sm font-medium text-text">Weekly Digest</div>
                        <div className="text-xs text-textMuted">Email summary of your sleep stats</div>
                     </div>
                  </div>
                  <button
                     role="switch"
                     aria-checked={emailDigest}
                     onClick={() => setEmailDigest(!emailDigest)}
                     className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-secondary ${emailDigest ? 'bg-secondary' : 'bg-background border border-border'}`}
                  >
                     <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailDigest ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </div>
            </div>
         </section>

         {/* Account */}
         <section className="space-y-4">
            <h2 className="text-xs font-bold text-textMuted uppercase tracking-wider ml-1">Account</h2>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
               <div className="p-4 flex items-center justify-between hover:bg-text/5 transition-colors cursor-pointer border-b border-border">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-textMuted">
                        <User size={24} />
                     </div>
                     <div>
                        <div className="text-text font-medium">{firstName}</div>
                        <div className="text-xs text-textMuted">{user.email}</div>
                     </div>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between hover:bg-text/5 transition-colors cursor-pointer">
                  <Link to="/NotFound " className="flex-1">
                     <div className="flex items-center gap-3 text-text px-4">
                        <Egg size={18} />
                        <span className="text-sm">Visit 404</span>
                     </div>
                  </Link>
                  <ChevronRight size={16} className="text-textMuted" />
               </div>
            </div>
         </section>

         <section className="pt-8 border-t border-border">
            <button className="flex items-center gap-2 text-error hover:text-error/80 transition-colors text-sm font-medium">
               <LogOut size={18} /> Sign Out
            </button>
         </section>
      </div>
   );
}