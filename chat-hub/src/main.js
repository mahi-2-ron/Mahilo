import './style.css'

const app = document.querySelector('#app')

// Realistic User Data with distinct personalities (Mutable for Add/Remove)
let friends = [
  {
    id: 1, name: 'Design Squad', avatar: 'DS', status: '5 active members', isGroup: true, members: [
      { name: 'Alex', color: '#3b82f6', mood: 'energetic' },
      { name: 'Sarah', color: '#10b981', mood: 'professional' },
      { name: 'Jamie', color: '#f59e0b', mood: 'chill' },
      { name: 'Maya', color: '#ec4899', mood: 'creative' }
    ]
  },
  { id: 2, name: 'Alex Rivera', avatar: 'AR', status: 'Online', isGroup: false, members: [{ name: 'Alex', color: '#3b82f6' }] },
  { id: 3, name: 'Sarah Chen', avatar: 'SC', status: 'Last seen 5m ago', isGroup: false, members: [{ name: 'Sarah', color: '#10b981' }] },
  {
    id: 4, name: 'Project Alpha', avatar: 'PA', status: '3 members', isGroup: true, members: [
      { name: 'Alex', color: '#3b82f6' },
      { name: 'Jamie', color: '#f59e0b' }
    ]
  },
]

let activeChatId = 1;

// Initial realistic message history
const messages = [
  { id: 1, chatId: 1, sender: 'Alex', text: 'Hey team! Anyone had a chance to look at the new mockups?', time: '10:30 AM', color: '#3b82f6' },
  { id: 2, chatId: 1, sender: 'Sarah', text: 'Checking them now. The typography feels much better.', time: '10:32 AM', color: '#10b981' },
  { id: 3, chatId: 1, sender: 'Maya', text: 'I love the glassmorphism on the sidebar. Very Apple-esque!', time: '10:33 AM', color: '#ec4899' },
  { id: 4, chatId: 1, sender: 'You', text: "Glad you like it! I'm optimizing the load times as we speak.", time: '10:35 AM', color: '#8b5cf6' },
]

function renderApp() {
  const activeChat = friends.find(f => f.id === activeChatId) || friends[0] || { name: 'Chat Hub', status: 'No chats', id: 0, members: [] };

  app.innerHTML = `
    <div class="chat-container">
      <div class="sidebar">
        <div class="sidebar-header">
           <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
             <div>
               <div class="premium-badge">PREMIUM</div>
               <h2>Chat Hub</h2>
             </div>
             <button class="add-btn" id="add-friend-btn" title="Add New Chat">+</button>
           </div>
        </div>
        <div class="user-list">
          ${friends.map(friend => `
            <div class="user-item ${friend.id === activeChatId ? 'active' : ''}" data-id="${friend.id}">
              <div class="avatar-stack">
                <div class="avatar" style="background: ${friend.isGroup ? 'linear-gradient(135deg, #4f46e5, #9333ea)' : ''}">${friend.avatar}</div>
                ${friend.status.includes('Online') ? '<div class="online-indicator"></div>' : ''}
              </div>
              <div class="user-info">
                <div class="name-row">
                  <span class="name">${friend.name}</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="time-stamp">10:35 AM</span>
                    <button class="remove-btn" onclick="window.removeChat(event, ${friend.id})" title="Remove Chat">×</button>
                  </div>
                </div>
                <span class="status">${friend.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sidebar-footer">
          <div class="current-user">
            <div class="avatar" style="width: 32px; height: 32px; font-size: 12px;">ME</div>
            <div class="user-info">
              <span class="name">Mahesh M.</span>
              <span class="status">Available</span>
            </div>
          </div>
          <button class="settings-btn">⚙️</button>
        </div>
      </div>
      
      <div class="chat-area">
        ${friends.length > 0 ? `
        <div class="chat-header">
          <div class="chat-header-info">
            <h3 class="active-chat-name">${activeChat.name}</h3>
            <div id="typing-indicator" class="typing-indicator"></div>
            <span class="chat-status">${activeChat.status}</span>
          </div>
          <div class="header-actions">
            <div class="member-dots">
               ${activeChat.members ? activeChat.members.slice(0, 3).map(m => `<div class="mini-avatar" title="${m.name}" style="background: ${m.color || '#4f46e5'}">${m.name[0]}</div>`).join('') : ''}
            </div>
            <button class="header-btn">📞</button>
            <button class="header-btn">🎥</button>
            <button class="header-btn">⋮</button>
          </div>
        </div>
        
        <div class="chat-messages" id="message-container">
           <div class="date-divider"><span>Today</span></div>
          ${messages.filter(m => m.chatId === activeChatId).map(msg => `
            <div class="message-wrapper ${msg.sender === 'You' ? 'sent' : 'received'}" style="animation: fadeInUp 0.3s ease-out">
              ${msg.sender !== 'You' ? `<span class="sender-name" style="color: ${msg.color || '#94a3b8'}">${msg.sender}</span>` : ''}
              <div class="message">
                <div class="text">${msg.text}</div>
                <div class="message-info">${msg.time} ${msg.sender === 'You' ? '<span class="read-receipt">✓✓</span>' : ''}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="input-area">
          <form class="input-wrapper" id="chat-form">
            <button type="button" class="action-btn">📎</button>
            <input type="text" placeholder="Type something to ${activeChat.name}..." id="message-input" autocomplete="off">
            <button type="button" class="action-btn">😊</button>
            <button type="submit" class="send-btn">
               <span class="send-icon">↗</span>
            </button>
          </form>
        </div>
        ` : `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.5;">
           <span style="font-size: 64px; margin-bottom: 20px;">💬</span>
           <h3>Start a new conversation</h3>
           <p>Click the + button in the sidebar to add a chat</p>
        </div>
        `}
      </div>
    </div>
  `

  attachEvents();
  scrollToBottom();
}

window.removeChat = (e, id) => {
  e.stopPropagation();
  friends = friends.filter(f => f.id !== id);
  if (activeChatId === id && friends.length > 0) {
    activeChatId = friends[0].id;
  }
  renderApp();
}

function attachEvents() {
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', () => {
      activeChatId = parseInt(item.dataset.id);
      renderApp();
    });
  });

  const addBtn = document.querySelector('#add-friend-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = prompt("Enter friend's name:");
      if (name && name.trim()) {
        const newChat = {
          id: Date.now(),
          name: name,
          avatar: name.substring(0, 2).toUpperCase(),
          status: 'Online',
          isGroup: false,
          members: [{ name: name, color: '#3b82f6' }]
        };
        friends.push(newChat);
        activeChatId = newChat.id;
        renderApp();
      }
    });
  }

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
      renderApp();
      simulateReplies();
    });
  }
}

function simulateReplies() {
  const activeChat = friends.find(f => f.id === activeChatId);
  if (!activeChat || !activeChat.members) return;

  const indicator = document.querySelector('#typing-indicator');

  setTimeout(() => {
    if (!indicator) return;
    const members = activeChat.members.filter(m => m.name !== 'You');
    if (members.length === 0) return;
    const replier = members[Math.floor(Math.random() * members.length)];

    indicator.innerHTML = `${replier.name} is typing...`;
    indicator.style.opacity = '1';

    setTimeout(() => {
      const replies = [
        "That looks incredible! Love the attention to detail.",
        "Wait, are we still going with the dark theme?",
        "Absolutely! Just sent you some feedback via email.",
        "The performance is night and day compared to the old one.",
        "Let's catch up on this in 10 mins? 🏃‍♂️",
        "Great work on the responsiveness!",
        "Does this work on Firefox as well?"
      ];

      const msg = {
        id: Date.now(),
        chatId: activeChatId,
        sender: replier.name,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: replier.color
      };

      if (activeChatId === msg.chatId) {
        messages.push(msg);
        renderApp();
      }
    }, 2000);
  }, 500);
}

function scrollToBottom() {
  const container = document.querySelector('#message-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

renderApp();
