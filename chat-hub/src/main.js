import './style.css'

const app = document.querySelector('#app')

// Simulation of multiple users (2-5 members)
const friends = [
  { id: 1, name: 'Design Squad', avatar: 'DS', status: 'Group • 5 members', isGroup: true, members: ['Alex', 'Sarah', 'Jamie', 'Maya', 'You'] },
  { id: 2, name: 'Alex Rivera', avatar: 'AR', status: 'Online', isGroup: false, members: ['Alex', 'You'] },
  { id: 3, name: 'Sarah Chen', avatar: 'SC', status: 'Typing...', isGroup: false, members: ['Sarah', 'You'] },
  { id: 4, name: 'Project Alpha', avatar: 'PA', status: 'Group • 3 members', isGroup: true, members: ['Alex', 'Jamie', 'You'] },
]

let activeChatId = 1;

// Initial messages
const messages = [
  { id: 1, chatId: 1, sender: 'Alex', text: 'Hey team! How is the project going?', time: '10:30 AM', color: '#3b82f6' },
  { id: 2, chatId: 1, sender: 'Sarah', text: 'Just finished the UI architecture. It looks sleek!', time: '10:32 AM', color: '#10b981' },
  { id: 3, chatId: 1, sender: 'Maya', text: 'Can we add glassmorphism to the sidebar?', time: '10:33 AM', color: '#f59e0b' },
  { id: 4, chatId: 1, sender: 'You', text: "Already on it! I'm using Vite for speed.", time: '10:35 AM', color: '#8b5cf6' },
]

function renderApp() {
  const activeChat = friends.find(f => f.id === activeChatId);

  app.innerHTML = `
    <div class="chat-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>Messages</h2>
        </div>
        <div class="user-list">
          ${friends.map(friend => `
            <div class="user-item ${friend.id === activeChatId ? 'active' : ''}" data-id="${friend.id}">
              <div class="avatar" style="background: ${friend.isGroup ? 'linear-gradient(135deg, #6366f1, #a855f7)' : ''}">${friend.avatar}</div>
              <div class="user-info">
                <span class="name">${friend.name}</span>
                <span class="status">${friend.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="chat-area">
        <div class="chat-header">
          <div class="chat-header-info">
            <h3 style="font-size: 18px; color: #f8fafc;">${activeChat.name}</h3>
            <span style="font-size: 12px; color: #94a3b8;">${activeChat.status}</span>
          </div>
          <div class="header-actions">
            <button class="header-btn">📞</button>
            <button class="header-btn">🎥</button>
            <button class="header-btn">⋮</button>
          </div>
        </div>
        
        <div class="chat-messages" id="message-container">
          ${messages.filter(m => m.chatId === activeChatId).map(msg => `
            <div class="message-wrapper ${msg.sender === 'You' ? 'sent' : 'received'}">
              ${msg.sender !== 'You' ? `<span class="sender-name" style="color: ${msg.color || '#94a3b8'}">${msg.sender}</span>` : ''}
              <div class="message">
                <div class="text">${msg.text}</div>
                <div class="message-info">${msg.time} ${msg.sender === 'You' ? '✓✓' : ''}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="input-area">
          <form class="input-wrapper" id="chat-form">
            <button type="button" class="action-btn">+</button>
            <input type="text" placeholder="Message ${activeChat.name}..." id="message-input" autocomplete="off">
            <button type="submit" class="send-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `

  attachEvents();
  scrollToBottom();
}

function attachEvents() {
  // Sidebar clicks
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', () => {
      activeChatId = parseInt(item.dataset.id);
      renderApp();
    });
  });

  // Form submission
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#message-input');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = {
        id: Date.now(),
        chatId: activeChatId,
        sender: 'You',
        text,
        time
      };

      messages.push(newMessage);
      renderApp(); // Rerender to show new message

      // Fake Reply Logic
      handleReply();
    });
  }
}

function handleReply() {
  const activeChat = friends.find(f => f.id === activeChatId);
  setTimeout(() => {
    const members = activeChat.members.filter(m => m !== 'You');
    if (members.length === 0) return;

    const randomMember = members[Math.floor(Math.random() * members.length)];
    const replies = [
      "That sounds like a great plan! 🚀",
      "I'm on it. Will update you soon. ✨",
      "Love the glassmorphism idea! 😍",
      "Can we review this tomorrow? 📅",
      "Perfect! Let's go with that. ✅"
    ];

    const replyMessage = {
      id: Date.now() + 1,
      chatId: activeChatId,
      sender: randomMember,
      text: replies[Math.floor(Math.random() * replies.length)],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: randomMember === 'Alex' ? '#3b82f6' :
        randomMember === 'Sarah' ? '#10b981' :
          randomMember === 'Jamie' ? '#f59e0b' : '#ec4899'
    };

    // Only push if the user is still in the same chat
    if (activeChatId === replyMessage.chatId) {
      messages.push(replyMessage);
      renderApp();
    }
  }, 2000);
}

function scrollToBottom() {
  const container = document.querySelector('#message-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// Initial render
renderApp();
