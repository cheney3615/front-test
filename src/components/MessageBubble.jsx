import './MessageBubble.css';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  // Simple markdown-like rendering: bold, code blocks, inline code, line breaks
  const renderContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const firstLine = code.indexOf('\n');
        const lang = firstLine > 0 ? code.slice(0, firstLine).trim() : '';
        const body = firstLine > 0 ? code.slice(firstLine + 1) : code;
        return (
          <pre key={i} className="code-block">
            {lang && <div className="code-lang">{lang}</div>}
            <code>{body}</code>
          </pre>
        );
      }
      // Process inline formatting
      return part.split('\n').map((line, j, arr) => {
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
        return (
          <span key={`${i}-${j}`}>
            <span dangerouslySetInnerHTML={{ __html: formatted }} />
            {j < arr.length - 1 && <br />}
          </span>
        );
      });
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
        {isUser ? (
          <span>C</span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </div>
      <div className="message-content">
        <div className="message-role">{isUser ? 'You' : 'ChatGPT'}</div>
        <div className="message-text">{renderContent(message.content)}</div>
      </div>
    </div>
  );
}

export default MessageBubble;
