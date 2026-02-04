import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatApi, userApi } from '../api/api';

export default function Chat() {
  const { username } = useAuth();
  const [users, setUsers] = useState([]);
  const [conversationIds, setConversationIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    userApi.getAll().then((r) => setUsers(r.data)).catch(() => setUsers([]));
    chatApi.getConversations().then((r) => setConversationIds(r.data)).catch(() => setConversationIds([]));
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const res = await chatApi.getWith(selectedUserId);
        setMessages(res.data);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    const poll = () => {
      chatApi.getWith(selectedUserId).then((r) => setMessages(r.data)).catch(() => {});
    };
    pollRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollRef.current);
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;
    try {
      await chatApi.send({ receiverId: selectedUserId, message: newMessage.trim() });
      setNewMessage('');
      const res = await chatApi.getWith(selectedUserId);
      setMessages(res.data);
      if (!conversationIds.includes(selectedUserId)) {
        setConversationIds([...conversationIds, selectedUserId]);
      }
    } catch {
      alert('Error sending message');
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const chatUsers = [...new Set([...conversationIds, selectedUserId].filter(Boolean))].map(
    (id) => users.find((u) => u.id === id) || { id, username: `User ${id}` }
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Chat</h1>
      <div className="flex gap-4 h-[500px] bg-white rounded-xl shadow overflow-hidden">
        <div className="w-64 border-r overflow-y-auto">
          <p className="p-3 font-medium text-slate-600">Conversations</p>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUserId(u.id)}
              className={`w-full text-left px-4 py-2 hover:bg-slate-50 ${
                selectedUserId === u.id ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
            >
              {u.username}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              <div className="p-3 border-b font-medium">{selectedUser?.username || 'User'}</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                  <p className="text-slate-500">Loading...</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.senderName === username ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          m.senderName === username
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <p className="text-sm opacity-80">{m.senderName}</p>
                        <p>{m.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {m.timestamp?.slice(0, 16).replace('T', ' ')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
