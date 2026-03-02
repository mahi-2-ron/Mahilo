import './style.css'

const app = document.querySelector('#app')

// Realistic User Data with distinct personalities
let friends = [
  {
    id: 1, name: 'Design Squad', avatar: 'DS', status: '5 active members', isGroup: true, members: [
      { name: 'Alex', color: '#3b82f6', mood: 'energetic', delay: 2000 },
      { name: 'Sarah', color: '#10b981', mood: 'professional', delay: 4500 },
      { name: 'Jamie', color: '#f59e0b', mood: 'chill', delay: 3000 },
      { name: 'Maya', color: '#ec4899', mood: 'creative', delay: 1500 }
    ]
  },
  { id: 2, name: 'Alex Rivera', avatar: 'AR', status: 'Online', isGroup: false, members: [{ name: 'Alex', color: '#3b82f6', delay: 2000 }] },
  { id: 3, name: 'Sarah Chen', avatar: 'SC', status: 'Last seen 5m ago', isGroup: false, members: [{ name: 'Sarah', color: '#10b981', delay: 4500 }] },
  {
    id: 4, name: 'Project Alpha', avatar: 'PA', status: '3 members', isGroup: true, members: [
      { name: 'Alex', color: '#3b82f6', delay: 2000 },
      { name: 'Jamie', color: '#f59e0b', delay: 3000 }
    ]
  },
]

let activeChatId = 1;

// Messages store status and reactions
let messages = [
  { id: 1, chatId: 1, sender: 'Alex', text: 'Hey team! Anyone had a chance to look at the new mockups?', time: '10:30 AM', color: '#3b82f6', reactions: { '🔥': 2 } },
  { id: 2, chatId: 1, sender: 'Sarah', text: 'Checking them now. The typography feels much better.', time: '10:32 AM', color: '#10b981', reactions: {} },
  { id: 3, chatId: 1, sender: 'Maya', text: 'I love the glassmorphism on the sidebar. Very Apple-esque!', time: '10:33 AM', color: '#ec4899', reactions: { '❤️': 3 } },
  { id: 4, chatId: 1, sender: 'You', text: "Glad you like it! I'm optimizing the load times as we speak.", time: '10:35 AM', color: '#8b5cf6', status: 'seen', reactions: {} },
]

function renderApp() {
  const activeChat = friends.find(f => f.id === activeChatId) || friends[0] || { name: 'Chat Hub', status: 'No chats', id: 0, members: [] };

  app.innerHTML = `
    <div class="chat-container">
      <div class="sidebar">
        <div class="sidebar-header">
           <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
             <div>
               <div class="premium-badge">PREMIUM Hub</div>
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
                    <span class="time-stamp">Just now</span>
                    <button class="remove-btn" data-id="${friend.id}" title="Remove Chat">×</button>
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
            <div id="typing-indicator" class="typing-indicator">
               <span id="typing-text"></span>
               <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
            <span class="chat-status">${activeChat.status}</span>
          </div>
          <div class="header-actions">
            <div class="member-dots">
               ${activeChat.members ? activeChat.members.slice(0, 3).map(m => `<div class="mini-avatar" title="${m.name}" style="background: ${m.color || '#4f46e5'}">${m.name[0]}</div>`).join('') : ''}
            </div>
            <button class="header-btn ripple">📞</button>
            <button class="header-btn ripple">🎥</button>
            <button class="header-btn ripple">⋮</button>
          </div>
        </div>
        
        <div class="chat-messages" id="message-container">
           <div class="date-divider"><span>Today</span></div>
          ${messages.filter(m => m.chatId === activeChatId).map(msg => `
            <div class="message-wrapper ${msg.sender === 'You' ? 'sent' : 'received'}" style="animation: fadeInUp 0.3s ease-out">
              ${msg.sender !== 'You' ? `<span class="sender-name" style="color: ${msg.color || '#94a3b8'}">${msg.sender}</span>` : ''}
              <div class="message" data-id="${msg.id}">
                <div class="text">${msg.text}</div>
                <div class="message-info">
                  ${msg.time} 
                  ${msg.sender === 'You' ? `
                    <span class="read-receipt ${msg.status || 'delivered'}">
                      ${msg.status === 'seen' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  ` : ''}
                </div>
              </div>
              <div class="reactions-container">
                ${Object.entries(msg.reactions || {}).map(([emoji, count]) => `
                  <div class="reaction" data-emoji="${emoji}" data-msg-id="${msg.id}">
                    <span>${emoji}</span>
                    <span class="reaction-count">${count}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="input-area">
          <form class="input-wrapper" id="chat-form">
            <button type="button" class="action-btn">📎</button>
            <input type="text" placeholder="Message ${activeChat.name}..." id="message-input" autocomplete="off">
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

function attachEvents() {
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', () => {
      activeChatId = parseInt(item.dataset.id);
      renderApp();
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      friends = friends.filter(f => f.id !== id);
      if (activeChatId === id && friends.length > 0) activeChatId = friends[0].id;
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
          members: [{ name: name, color: '#3b82f6', delay: 2500 }]
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
        time,
        status: 'sent',
        reactions: {}
      };

      messages.push(newMessage);
      input.value = '';
      renderApp();

      // Simulate delievery and seen
      setTimeout(() => {
        newMessage.status = 'delivered';
        renderApp();
        setTimeout(() => {
          newMessage.status = 'seen';
          renderApp();
          simulateReplies();
        }, 1000);
      }, 800);
    });
  }

  // Double click to react
  document.querySelectorAll('.message').forEach(msgEl => {
    msgEl.addEventListener('dblclick', () => {
      const msgId = parseInt(msgEl.dataset.id);
      const msg = messages.find(m => m.id === msgId);
      if (msg) {
        const emojis = ['❤️', '🔥', '😂', '👍', '😮'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        msg.reactions[randomEmoji] = (msg.reactions[randomEmoji] || 0) + 1;
        renderApp();
      }
    });
  });
}

function simulateReplies() {
  const activeChat = friends.find(f => f.id === activeChatId);
  if (!activeChat || !activeChat.members) return;

  const indicator = document.querySelector('#typing-indicator');
  const typingText = document.querySelector('#typing-text');

  const members = activeChat.members.filter(m => m.name !== 'You');
  if (members.length === 0) return;
  const replier = members[Math.floor(Math.random() * members.length)];

  // Random delay before starting to "type"
  setTimeout(() => {
    if (!indicator || !typingText) return;
    typingText.innerText = `${replier.name}`;
    indicator.style.opacity = '1';

    // Typing duration based on message length
    const replies = [
      "That looks incredible! Love the attention to detail.",
      "Wait, are we still going with the dark theme?",
      "Absolutely! Just sent you some feedback via email.",
      "The performance is night and day compared to the old one.",
      "Let's catch up on this in 10 mins? 🏃‍♂️",
      "Great work! 🚀",
      "I'm working on the assets now.",
      "Can we hop on a quick call?",
      "Looks good to me!"
    ];

    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const typingDuration = Math.min(Math.max(replyText.length * 50, 1000), 4000);

    setTimeout(() => {
      const msg = {
        id: Date.now(),
        chatId: activeChatId,
        sender: replier.name,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: replier.color,
        reactions: {}
      };

      if (activeChatId === msg.chatId) {
        messages.push(msg);
        indicator.style.opacity = '0';
        renderApp();
      }
    }, typingDuration);
  }, 1000);
}

function scrollToBottom() {
  const container = document.querySelector('#message-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

renderApp();
