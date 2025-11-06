import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css/MessageModal.css";

export default function MessageModalConversations({ isOpen, onClose, productId, recipientId }) {
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${productId}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Erro ao buscar as mensagens:", err);
      }
    };

    fetchMessages();
  }, [isOpen, productId, token]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/messages`,
        { recipientId, productId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");

      // Atualizar mensagens no modal sem fechar
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${productId}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setSending(false);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="conversation-modal" onClick={onClose}>
      <div className="conversation-box" onClick={(e) => e.stopPropagation()}>
        <div className="conversation-header">
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="conversation-messages">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-bubble ${msg.sender._id === user.id ? "sent" : "received"}`}
            >
              <span className="message-sender-name">
                {msg.sender._id === user.id ? "Tu" : `${msg.sender.name} ${msg.sender.surname}`}
              </span>
              <span className="message-text">{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="conversation-input">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreva a sua mensagem..."
          />
          <button onClick={handleSendMessage} disabled={sending}>
            {sending ? "A enviar..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
