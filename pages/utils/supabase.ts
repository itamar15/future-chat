// --- המשך פרויקט ichat: הוספת מערכת צ'אט בסיסית (פרטי + קבוצתי) ---

// 1. pages/chat.tsx - דף צ'אט ראשי
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error) setMessages(data || []);
    };

    getSession();
    fetchMessages();

    const channel = supabase
      .channel('chat-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      type: "text",
      created_at: new Date().toISOString(),
    });
    if (!error) setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="p-4 bg-black text-lg font-bold shadow">iChat 💬</header>
      <main className="flex-1 overflow-y-scroll p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-800 p-3 rounded-xl max-w-xs" style={{ alignSelf: msg.sender_id === user?.id ? 'flex-end' : 'flex-start' }}>
            {msg.content}
          </div>
        ))}
      </main>
      <footer className="p-4 bg-black flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800"
          placeholder="הקלד הודעה..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">שלח</button>
      </footer>
    </div>
  );
}

// 2. שינוי בטבלה Supabase: messages
// יש לוודא שהטבלה כוללת את השדות:
// id (uuid), content (text), type (text), sender_id (uuid), created_at (timestamp)

// 3. נתמך ב-WebSocket (Real-time) ע"י Supabase Channels

// שאר הקבצים (index.tsx, auth.tsx וכו') נשארים כפי שהיו.

// TODO בהמשך:
// - צ'אטים קבוצתיים
// - תמיכה בקבצים/מדיה
// - עריכה ומחיקה של הודעות
// - הצגת שם משתמש ותמונה ליד כל הודעה
// - ניהול "בקשת התחלת שיחה"

