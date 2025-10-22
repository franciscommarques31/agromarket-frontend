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
  const [filter, setFilter] = useState("comprar"); // padrão: comprar

  const messagesEndRef = useRef(null);

  // Scroll automático para o fim
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Buscar conversas
  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/messages", {
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

  // Filtrar conversas por tipo (comprar / vender)
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

  // Selecionar conversa
  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    try {
      const res = await fetch(`http://localhost:3000/api/messages/${conv.product._id}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Erro ao buscar mensagens da conversa:", err);
      setMessages([]);
    }
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);

    const recipientId =
      selectedConversation.sender._id === user.id
        ? selectedConversation.recipient._id
        : selectedConversation.sender._id;

    try {
      const res = await fetch("http://localhost:3000/api/messages", {
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

      setMessages(prev => [...prev, data.message]);

      // Atualiza a lista de conversas com a última mensagem
      setConversations(prev =>
        prev.map(conv =>
          conv._id === selectedConversation._id
            ? { ...conv, content: newMessage }
            : conv
        )
      );

      setNewMessage("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header />
      <div className="messages-page">
        <div className="conversations-container">
          <div className="conversations-list">
            {/* Botões de filtro */}
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
                    onChange={e => setNewMessage(e.target.value)}
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
