// התחלה של פרויקט ichat עם חיבור Supabase ודף נחיתה מרשים

// --- קבצים עיקריים ---

// 1. pages/index.tsx - דף נחיתה
export default function Home() {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white flex items-center justify-center p-8">
        <div className="max-w-xl text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">ברוך הבא ל-iChat 🚀</h1>
          <p className="text-lg mb-8">אפליקציית צ'אט מודרנית, טכנולוגית ומהירה. צ'אטים פרטיים, קבוצות, קבצים, ניהול – הכל במקום אחד.</p>
          <a href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-2xl text-xl transition-all shadow-lg">התחל עכשיו</a>
        </div>
      </main>
    );
  }
  
  // 2. pages/auth.tsx - התחברות / הרשמה
  import { useState } from "react";
  import { supabase } from "../utils/supabase";
  
  export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      if (isRegister) {
        await supabase.auth.signUp({ email, password });
      } else {
        await supabase.auth.signInWithPassword({ email, password });
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-900 p-6 rounded-xl shadow-xl space-y-4">
          <h2 className="text-2xl font-bold">{isRegister ? "הרשמה" : "התחברות"}</h2>
          <input className="w-full p-2 rounded bg-gray-800" type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full p-2 rounded bg-gray-800" type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">{isRegister ? "הרשם" : "התחבר"}</button>
          <p className="text-sm text-center cursor-pointer text-blue-400" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "כבר רשום? התחבר" : "אין לך חשבון? הירשם עכשיו"}
          </p>
        </form>
      </div>
    );
  }
  
  // 3. utils/supabase.ts - חיבור ל-Supabase
  import { createClient } from "@supabase/supabase-js";
  
  const supabaseUrl = "https://mjxsjmjyeawhpemrcglf.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeHNqbWp5ZWF3aHBlbXJjZ2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTY2NTMsImV4cCI6MjA1OTY3MjY1M30.NeTzzorRnYOU0Z6447m6sUA50ZVF480dg8MjShALawM";
  
  export const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 4. tailwind.config.js - הגדרות עיצוב
  module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        animation: {
          "fade-in": "fadeIn 1s ease-out forwards",
        },
        keyframes: {
          fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        },
      },
    },
    plugins: [],
  };
  
  // 5. .env.local (תבנית)
  // NEXT_PUBLIC_SUPABASE_URL=https://mjxsjmjyeawhpemrcglf.supabase.co
  // NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeHNqbWp5ZWF3aHBlbXJjZ2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTY2NTMsImV4cCI6MjA1OTY3MjY1M30.NeTzzorRnYOU0Z6447m6sUA50ZVF480dg8MjShALawM
  