/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  RefreshCcw, 
  Terminal, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Copy,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, formatTime } from "./lib/utils";
import { analyzePasswordSecurity } from "./lib/gemini";

// Setup zxcvbn options
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};
zxcvbnOptions.setOptions(options);

export default function App() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastCopied, setLastCopied] = useState(false);

  const calculateStrength = useCallback((pwd: string) => {
    if (!pwd) {
      setAnalysis(null);
      return;
    }
    const result = zxcvbn(pwd);
    setAnalysis(result);
  }, []);

  useEffect(() => {
    calculateStrength(password);
  }, [password, calculateStrength]);

  const handleAiAnalysis = async () => {
    if (!password) return;
    setIsAiLoading(true);
    const result = await analyzePasswordSecurity(password);
    setAiInsight(result);
    setIsAiLoading(false);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let newPassword = "";
    const length = 16;
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setShowPassword(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setLastCopied(true);
    setTimeout(() => setLastCopied(false), 2000);
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return "bg-red-500";
      case 1: return "bg-orange-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-emerald-500";
      default: return "bg-slate-700";
    }
  };

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0: return "O'ta zaif";
      case 1: return "Zaif";
      case 2: return "O'rtacha";
      case 3: return "Yaxshi";
      case 4: return "Mukammal";
      default: return "Kutilmoqda";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
          >
            <Terminal size={14} />
            <span>Kiberxavfsizlik Laboratoriyasi</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            Parol Tahlilchisi <span className="text-emerald-500">Pro</span>
          </motion.h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Paroliningizni kiriting va biz uni kiber-hujumlar, matematik entropiya va AI algoritmlari orqali tahlil qilamiz.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Lock size={120} />
              </div>

              <div className="relative space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-slate-400 ml-1">Parolni kiriting</label>
                  <button 
                    onClick={generatePassword}
                    className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <RefreshCcw size={12} />
                    Tasodifiy yaratish
                  </button>
                </div>

                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masalan: P@ssw0rd123!"
                    className="w-full bg-slate-950 border-2 border-slate-800 focus:border-emerald-500/50 rounded-2xl px-6 py-4 text-xl font-mono tracking-wider outline-none transition-all placeholder:text-slate-700"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {password && (
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors relative"
                      >
                        {lastCopied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                        {lastCopied && (
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded">Nusxalandi</span>
                        )}
                      </button>
                    )}
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Strength Meter */}
                {analysis && (
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn("text-lg font-bold", 
                        analysis.score < 2 ? "text-red-400" : 
                        analysis.score < 4 ? "text-yellow-400" : "text-emerald-400"
                      )}>
                        {getStrengthLabel(analysis.score)}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Entropiya: {Math.round(analysis.guesses_log10)} bits</span>
                    </div>
                    <div className="flex gap-2 h-2">
                      {[0, 1, 2, 3].map((step) => (
                        <div 
                          key={step}
                          className={cn(
                            "flex-1 rounded-full transition-all duration-500",
                            analysis.score > step ? getStrengthColor(analysis.score) : "bg-slate-800"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Detailed Stats */}
            {analysis && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    Buzib kirish vaqti
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Tezkor (100k/s)</span>
                      <span className="text-sm font-mono text-slate-200">{formatTime(analysis.crack_times_seconds.online_no_throttling_10_per_second * 10000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Superkompyuter</span>
                      <span className="text-sm font-mono text-slate-200">{formatTime(analysis.crack_times_seconds.offline_slow_hashing_1e4 * 1000)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded-lg mt-2">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Xavf darajasi</span>
                      <span className="text-sm font-mono text-white">{analysis.score < 2 ? "YUQORI" : analysis.score < 4 ? "O'RTA" : "PAST"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                    <Info size={18} className="text-blue-500" />
                    Murakkablik tahlili
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {password.length >= 8 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                      <span className="text-xs text-slate-400">8+ belgi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[A-Z]/.test(password) ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                      <span className="text-xs text-slate-400">Katta harf</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[0-9]/.test(password) ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                      <span className="text-xs text-slate-400">Raqamlar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[^A-Za-z0-9]/.test(password) ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                      <span className="text-xs text-slate-400">Belgilar</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-1">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-slate-900 border border-slate-800 rounded-3xl h-full flex flex-col"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <Terminal size={20} className="text-emerald-500" />
                  AI Ekspert
                </h2>
                {!aiInsight && password && (
                  <button 
                    onClick={handleAiAnalysis}
                    disabled={isAiLoading}
                    className="text-xs bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-full font-bold hover:bg-emerald-400 disabled:opacity-50 transition-all uppercase"
                  >
                    Tahlil
                  </button>
                )}
              </div>
              
              <div className="flex-1 p-6 relative">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <RefreshCcw className="animate-spin text-emerald-500" size={32} />
                    <p className="text-sm text-slate-500">AI tahlil qilmoqda...</p>
                  </div>
                ) : aiInsight ? (
                  <div className="prose prose-invert prose-sm">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {aiInsight}
                    </p>
                    <button 
                      onClick={() => setAiInsight(null)}
                      className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline"
                    >
                      Yangi tahlil
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 grayscale">
                    <ShieldAlert size={48} className="text-slate-700" />
                    <p className="text-sm text-slate-500">
                      Parol kiriting va AI yordamida chuqur xavfsizlik tahlilini oling.
                    </p>
                  </div>
                )}
              </div>

              {/* Tips footer */}
              <div className="p-6 bg-slate-950/50 rounded-b-3xl border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                   Xavfsizlik bo'yicha maslahat
                </div>
                <p className="text-xs text-slate-400 italic">
                  "Parol emas, balki bir nechta so'zdan iborat 'passphrase' dan foydalaning. Masalan: 'olma-kitob-quyosh-2024'."
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Feedback Section */}
        {analysis && analysis.feedback && (analysis.feedback.warning || analysis.feedback.suggestions.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500 text-amber-950 rounded-lg mt-1">
                <ShieldAlert size={20} />
              </div>
              <div className="space-y-3">
                {analysis.feedback.warning && (
                  <p className="font-bold text-amber-500 text-sm">{analysis.feedback.warning}</p>
                )}
                {analysis.feedback.suggestions.length > 0 && (
                  <ul className="space-y-1">
                    {analysis.feedback.suggestions.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-amber-200/70 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
