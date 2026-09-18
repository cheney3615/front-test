import { useState, useEffect, useRef, useCallback } from 'react';
import './Sidebar.css';

function Sidebar({ conversations, activeId, isOpen, onToggle, onSelect, onNewChat, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null);
  const toggleRef = useRef(null);
  const newChatRef = useRef(null);
  const listRef = useRef(null);

  // Store latest callbacks in refs so event listeners always call the current version
  const callbacksRef = useRef({ onToggle, onSelect, onNewChat, onDelete });
  useEffect(() => {
    callbacksRef.current = { onToggle, onSelect, onNewChat, onDelete };
  });

  useEffect(() => {
    const btn = toggleRef.current;
    if (!btn) return;
    const handler = () => callbacksRef.current.onToggle();
    btn.addEventListener('click', handler);
    return () => btn.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const btn = newChatRef.current;
    if (!btn) return;
    const handler = () => callbacksRef.current.onNewChat();
    btn.addEventListener('click', handler);
    return () => btn.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const handleClick = (e) => {
      const item = e.target.closest('.conversation-item');
      if (!item) return;
      if (e.target.closest('.delete-btn')) {
        callbacksRef.current.onDelete(item.dataset.id);
      } else {
        callbacksRef.current.onSelect(item.dataset.id);
      }
    };

    const handleOver = (e) => {
      const item = e.target.closest('.conversation-item');
      if (item) setHoveredId(item.dataset.id);
    };

    const handleOut = (e) => {
      const item = e.target.closest('.conversation-item');
      if (item && !item.contains(e.relatedTarget)) setHoveredId(null);
    };

    list.addEventListener('click', handleClick);
    list.addEventListener('mouseover', handleOver);
    list.addEventListener('mouseout', handleOut);
    return () => {
      list.removeEventListener('click', handleClick);
      list.removeEventListener('mouseover', handleOver);
      list.removeEventListener('mouseout', handleOut);
    };
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle" ref={toggleRef} title="Close sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
        <button className="new-chat-btn" ref={newChatRef} title="New chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="sidebar-content">
        <div className="conversation-list" ref={listRef}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.id === activeId ? 'active' : ''}`}
              data-id={conv.id}
              title={conv.title}
            >
              <div className="conversation-title">{conv.title}</div>
              {hoveredId === conv.id && (
                <button className="delete-btn" title="Delete conversation">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">C</div>
          <span className="user-name">Cheney</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
