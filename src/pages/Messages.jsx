import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import "../css/Messages.css";

export default function Messages() {
  const { token, user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("comprar");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };
    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (!conversations.length || !user) return;

    const filtered = conversations.filter(conv => {
      const hasProductUser = conv.product && conv.product.user && conv.product.user._id;
      if (!hasProductUser) return false;

      return filter === "comprar"
        ? conv.product.user._id !== user.id
        : conv.product.user._id === user.id;
    });

    setFilteredConversations(filtered);
  }, [filter, conversations, user]);

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${conv.product._id}/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Erro ao buscar mensagens da conversa:", err);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);

    const recipientId =
      selectedConversation.sender._id === user.id
        ? selectedConversation.recipient._id
        : selectedConversation.sender._id;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId,
          productId: selectedConversation.product._id,
          content: newMessage,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;

    const confirmDelete = window.confirm("Apagar conversa?");
    if (!confirmDelete) return;

    const otherUserId =
      selectedConversation.sender._id === user.id
        ? selectedConversation.recipient._id
        : selectedConversation.sender._id;

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${selectedConversation.product._id}/${otherUserId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConversations(prev =>
        prev.filter(c => c._id !== selectedConversation._id)
      );
      setSelectedConversation(null);
      setMessages([]);
    } catch (err) {
      console.error("Erro ao apagar conversa:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="messages-page">
        <div className="conversations-container">
          <div className="conversations-list">
            <div className="conversations-list-buttons">
              <button
                className={filter === "comprar" ? "active" : ""}
                onClick={() => setFilter("comprar")}
              >
                Comprar
              </button>
              <button
                className={filter === "vender" ? "active" : ""}
                onClick={() => setFilter("vender")}
              >
                Vender
              </button>
            </div>

            {filteredConversations.length === 0 ? (
              <p className="no-messages">Não há mensagens.</p>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv._id}
                  className={`conversation-card ${
                    selectedConversation?._id === conv._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img
                    src={
                      conv.product?.imagens[0] ||
                      "https://via.placeholder.com/60x60?text=Sem+Imagem"
                    }
                    alt={conv.product?.produto || "Produto"}
                  />
                  <div className="conversation-info">
                    <h4>
                      {conv.product?.produto || "Produto"} -{" "}
                      {conv.product?.marca || ""}{" "}
                      {conv.product?.modelo || ""}
                    </h4>
                    <p>
                      <strong>
                        {conv.sender._id === user.id
                          ? "Para: " + conv.recipient.name
                          : "De: " + conv.sender.name}
                      </strong>{" "}
                      {conv.content.length > 40
                        ? conv.content.substring(0, 40) + "..."
                        : conv.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="conversation-detail">
            {selectedConversation ? (
              <>
                <div className="chat-header">
                  <img
                    src={
                      selectedConversation.product?.imagens[0] ||
                      "https://via.placeholder.com/60x60?text=Sem+Imagem"
                    }
                    alt={selectedConversation.product?.produto || "Produto"}
                  />
                  <h3>
                    {selectedConversation.product?.produto || "Produto"} -{" "}
                    {selectedConversation.product?.marca || ""}{" "}
                    {selectedConversation.product?.modelo || ""}
                  </h3>

                  <button className="delete-chat" onClick={handleDeleteConversation}>
                    ❌
                  </button>
                </div>

                <div className="chat-messages">
                  {messages.map(msg => (
                    <div
                      key={msg._id}
                      className={`message-bubble ${
                        msg.sender._id === user.id ? "sent" : "received"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <textarea
                    placeholder="Escreve uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button onClick={handleSendMessage} disabled={sending}>
                    {sending ? "A enviar..." : "Enviar"}
                  </button>
                </div>
              </>
            ) : (
              <p className="no-conversation">Selecione uma conversa à esquerda</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
