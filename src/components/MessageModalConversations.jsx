import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../css/MessageModalConversations.css";

export default function MessageModalConversations({ isOpen, onClose, productId, recipientId }) {
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/messages/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post(
        "http://localhost:3000/api/messages",
        { recipientId, productId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchMessages();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="message-modal" onClick={onClose}>
      <div className="message-chat-box" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <img
            src="https://via.placeholder.com/50"
            alt="Produto"
          />
          <div className="chat-product-info">
            <h4>Produto</h4>
            <p>Conversa</p>
          </div>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat-message ${msg.sender._id === user.id ? "sent" : "received"}`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Escreva a sua mensagem..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
