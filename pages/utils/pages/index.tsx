// --- המשך פרויקט ichat: הוספת תמיכה בצ'אטים קבוצתיים ---

// 1. pages/chat.tsx - דף צ'אט ראשי (כולל תמיכה בקבוצות)
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [groupId, setGroupId] = useState<string | null>(null); // group ID לצ'אט קבוצתי
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id, groups(name)")
        .eq("user_id", user?.id);
      if (!error) setGroups(data || []);
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!groupId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: true });
      if (!error) setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-room-${groupId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.group_id === groupId) {
          fetchMessages();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !groupId) return;
    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      type: "text",
      group_id: groupId,
      created_at: new Date().toISOString(),
    });
    if (!error) setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <aside className="w-1/4 bg-black p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">הקבוצות שלי</h2>
        {groups.map((g) => (
          <div
            key={g.group_id}
            className={`p-2 rounded cursor-pointer mb-2 ${g.group_id === groupId ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setGroupId(g.group_id)}
          >
            {g.groups?.name || "קבוצה"}
          </div>
        ))}
      </aside>

      <div className="flex flex-col flex-1">
        <header className="p-4 bg-black text-lg font-bold shadow">iChat קבוצתי 💬</header>

        <main className="flex-1 overflow-y-scroll p-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-gray-800 p-3 rounded-xl max-w-xs"
              style={{ alignSelf: msg.sender_id === user?.id ? 'flex-end' : 'flex-start' }}
            >
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
    </div>
  );
}

// הערות ל-Supabase:
// messages: יש לוודא הוספת שדה group_id (uuid)
// group_members: (id, group_id, user_id)
// groups: (id, name, description, image)

// TODO בהמשך:
// - קבצים/תמונות
// - עריכה/מחיקה
// - פרופילים ליד הודעה
// - בקשת התחלת שיחה
