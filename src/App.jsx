import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

const initialConversations = [
  {
    id: '1',
    title: 'React Performance Tips',
    messages: [
      { id: 'm1', role: 'user', content: 'How can I optimize React rendering performance?' },
      { id: 'm2', role: 'assistant', content: 'There are several strategies to optimize React rendering:\n\n1. **Use React.memo** for functional components that receive the same props frequently.\n2. **useMemo and useCallback** hooks to memoize expensive computations and callback functions.\n3. **Virtualize long lists** using libraries like react-window or react-virtualized.\n4. **Code splitting** with React.lazy and Suspense to load components on demand.\n5. **Avoid unnecessary state updates** — keep state as local as possible.' },
      { id: 'm3', role: 'user', content: 'What about using keys properly in lists?' },
      { id: 'm4', role: 'assistant', content: 'Great question! Keys help React identify which items have changed, been added, or removed. Here are best practices:\n\n- **Use stable, unique IDs** as keys (like database IDs), not array indices.\n- **Avoid using Math.random()** as keys — it defeats the purpose entirely.\n- **Keys should be consistent** across re-renders to avoid unnecessary DOM manipulation.\n\nUsing proper keys can significantly reduce reconciliation time in large lists.' },
    ],
  },
  {
    id: '2',
    title: 'CSS Grid vs Flexbox',
    messages: [
      { id: 'm5', role: 'user', content: 'When should I use CSS Grid instead of Flexbox?' },
      { id: 'm6', role: 'assistant', content: 'Both are powerful layout tools, but they excel in different scenarios:\n\n**CSS Grid** is best for:\n- Two-dimensional layouts (rows AND columns)\n- Complex page layouts\n- When you need precise control over both axes\n\n**Flexbox** is best for:\n- One-dimensional layouts (row OR column)\n- Distributing space among items\n- Centering content\n- Navigation bars and toolbars\n\nIn practice, they complement each other beautifully. Use Grid for the overall page structure and Flexbox for component-level alignment.' },
    ],
  },
  {
    id: '3',
    title: 'JavaScript Closures',
    messages: [
      { id: 'm7', role: 'user', content: 'Can you explain closures in JavaScript?' },
      { id: 'm8', role: 'assistant', content: 'A closure is a function that remembers the variables from its outer scope even after the outer function has finished executing.\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\nThe inner function "closes over" the `count` variable. Even though `createCounter` has returned, the inner function still has access to `count`. This is incredibly useful for data privacy, factory functions, and maintaining state in functional programming.' },
    ],
  },
];

const mockResponses = [
  "That's a great question! Let me think about this...\n\nBased on my understanding, the key insight here is that modern web development has evolved significantly. The best approach depends on your specific use case, team expertise, and performance requirements.\n\nWould you like me to elaborate on any specific aspect?",
  "Here's what I'd recommend:\n\n1. **Start with a clear architecture** — define your data flow and component hierarchy before writing code.\n2. **Use TypeScript** for better developer experience and fewer runtime errors.\n3. **Write tests early** — unit tests for utilities, integration tests for critical flows.\n4. **Optimize incrementally** — don't prematurely optimize, but measure and improve.\n\nLet me know if you'd like me to dive deeper into any of these points!",
  "Absolutely! This is one of the most common patterns in modern frontend development.\n\nThe core idea is to separate concerns while maintaining a clean data flow. Think of your application as a tree of components, each responsible for a specific piece of the UI.\n\n```javascript\n// Example pattern\nconst App = () => (\n  <Layout>\n    <Sidebar />\n    <MainContent>\n      <Header />\n      <Body />\n    </MainContent>\n  </Layout>\n);\n```\n\nThis approach makes your code more maintainable, testable, and easier to reason about.",
  "I'd be happy to help with that! Here are some thoughts:\n\n**The short answer:** It depends on your requirements and constraints.\n\n**The longer answer:** There are trade-offs to consider. Performance, developer experience, bundle size, and ecosystem support all play a role in the decision.\n\nThe most important thing is to understand your users' needs and choose the approach that best serves them. Would you like me to compare specific options?",
];

function App() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
    setInputValue('');
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMessage = { id: `u-${Date.now()}`, role: 'user', content: text };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversationId) return c;
        const updated = { ...c, messages: [...c.messages, userMessage] };
        if (c.messages.length === 0) {
          updated.title = text.length > 40 ? text.slice(0, 40) + '…' : text;
        }
        return updated;
      })
    );
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const assistantMessage = { id: `a-${Date.now()}`, role: 'assistant', content: response };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c
        )
      );
      setIsTyping(false);
    }, 1200 + Math.random() * 1500);
  };

  const handleDeleteConversation = (id) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (id === activeConversationId && filtered.length > 0) {
        setActiveConversationId(filtered[0].id);
      } else if (filtered.length === 0) {
        handleNewChat();
      }
      return filtered;
    });
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onSelect={setActiveConversationId}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />
      <ChatArea
        conversation={activeConversation}
        inputValue={inputValue}
        isTyping={isTyping}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onInputChange={setInputValue}
        onSend={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}

export default App;
