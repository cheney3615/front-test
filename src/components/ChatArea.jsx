import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import './ChatArea.css';

function ChatArea({
  conversation,
  inputValue,
  isTyping,
  sidebarOpen,
  onToggleSidebar,
  onInputChange,
  onSend,
  messagesEndRef,
}) {
  const toggleRef = useRef(null);
  const sendRef = useRef(null);
  const textareaRef = useRef(null);

  const callbacksRef = useRef({ onToggleSidebar, onInputChange, onSend });
  useEffect(() => {
    callbacksRef.current = { onToggleSidebar, onInputChange, onSend };
  });

  // Sidebar toggle button (conditionally rendered — re-attach when sidebarOpen changes)
  useEffect(() => {
    const btn = toggleRef.current;
    if (!btn) return;
    const handler = () => callbacksRef.current.onToggleSidebar();
    btn.addEventListener('click', handler);
    return () => btn.removeEventListener('click', handler);
  }, [sidebarOpen]);

  // Send button
  useEffect(() => {
    const btn = sendRef.current;
    if (!btn) return;
    const handler = () => callbacksRef.current.onSend();
    btn.addEventListener('click', handler);
    return () => btn.removeEventListener('click', handler);
  }, []);

  // Textarea input + Enter key
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    const handleInput = (e) => callbacksRef.current.onInputChange(e.target.value);
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        callbacksRef.current.onSend();
      }
    };

    ta.addEventListener('input', handleInput);
    ta.addEventListener('keydown', handleKeyDown);
    return () => {
      ta.removeEventListener('input', handleInput);
      ta.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, [inputValue]);

  const messages = conversation?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <main className={`chat-area ${sidebarOpen ? '' : 'full-width'}`}>
      {/* Top bar */}
      <div className="chat-header">
        {!sidebarOpen && (
          <button className="sidebar-open-btn" ref={toggleRef} title="Open sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        )}
        <h1 className="model-name">ChatGPT <span className="model-badge">Demo</span></h1>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {isEmpty && !isTyping ? (
          <div className="empty-state">
            <div className="empty-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                <path d="M16 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="32" r="2" fill="currentColor" />
              </svg>
            </div>
            <h2>How can I help you today?</h2>
            <div className="empty-suggestions">
              <div className="suggestion-card">Explain quantum computing in simple terms</div>
              <div className="suggestion-card">Write a Python script for data analysis</div>
              <div className="suggestion-card">Help me debug my React component</div>
              <div className="suggestion-card">Compare REST vs GraphQL architecture</div>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="message-avatar assistant-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder="Message ChatGPT…"
            rows="1"
            value={inputValue}
          />
          <button
            className={`send-btn ${inputValue.trim() && !isTyping ? 'active' : ''}`}
            ref={sendRef}
            disabled={!inputValue.trim() || isTyping}
            title="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L12 22M12 2L5 9M12 2L19 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
        <p className="disclaimer">ChatGPT Demo — This is a static mock interface for demonstration purposes only.</p>
      </div>
    </main>
  );
}

export default ChatArea;
