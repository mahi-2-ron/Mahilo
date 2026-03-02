import './style.css'

const app = document.querySelector('#app')

// Global State to survive re-renders
const state = {
  activeChatId: 1,
  isTyping: false,
  typingName: '',
  smartReplies: ["Sounds good!", "I'll check it out.", "Perfect!", "Can't wait!", "Tell me more."],
  friends: [
    {
      id: 1, name: 'Design Squad', avatarIcon: 'DS', status: '5 active members', isGroup: true,
      members: [
        { name: 'Alex', color: '#3b82f6', class: 'alex' },
        { name: 'Sarah', color: '#10b981', class: 'sarah' },
        { name: 'Jamie', color: '#f59e0b', class: 'jamie' },
        { name: 'Maya', color: '#ec4899', class: 'maya' }
      ]
    },
    { id: 2, name: 'Alex Rivera', avatarIcon: 'AR', status: 'Online', isGroup: false, members: [{ name: 'Alex', color: '#3b82f6', class: 'alex' }] },
    { id: 3, name: 'Sarah Chen', avatarIcon: 'SC', status: 'Away', isGroup: false, members: [{ name: 'Sarah', color: '#10b981', class: 'sarah' }] },
    {
      id: 4, name: 'Project Alpha', avatarIcon: 'PA', status: '3 members', isGroup: true,
      members: [
        { name: 'Alex', color: '#3b82f6', class: 'alex' },
        { name: 'Jamie', color: '#f59e0b', class: 'jamie' }
      ]
    },
  ],
  messages: [
    { id: 1, chatId: 1, sender: 'Alex', text: 'Hey team! Anyone had a chance to look at the new mockups?', time: '10:30 AM', color: '#3b82f6', reactions: { '🔥': 2 }, senderClass: 'alex' },
    { id: 2, chatId: 1, sender: 'Sarah', text: 'Checking them now. The typography feels much better.', time: '10:32 AM', color: '#10b981', reactions: {}, senderClass: 'sarah' },
    { id: 3, chatId: 1, sender: 'Maya', text: 'I love the glassmorphism on the sidebar. Very Apple-esque!', time: '10:33 AM', color: '#ec4899', reactions: { '❤️': 3 }, senderClass: 'maya' },
    { id: 4, chatId: 1, sender: 'You', text: "Glad you like it! I'm optimizing the load times as we speak.", time: '10:35 AM', color: '#8b5cf6', status: 'seen', reactions: {} },
  ]
};

// Utility for consistent colors
const getAvatarColor = (name) => {
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4'];
  return colors[Math.abs(hash) % colors.length];
};

function renderApp() {
  const activeChat = state.friends.find(f => f.id === state.activeChatId) || state.friends[0] || { name: 'Chat Hub', status: 'No chats', id: 0, members: [] };

  app.innerHTML = `
    <div class="chat-container">
      <div class="sidebar">
        <div class="sidebar-header">
           <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
             <div>
               <div class="premium-badge">PREMIUM Hub</div>
               <h2>Chat Hub</h2>
             </div>
             <button class="add-btn ripple" id="add-friend-btn" title="Add New Chat">+</button>
           </div>
        </div>
        <div class="user-list">
          ${state.friends.map(friend => `
            <div class="user-item ${friend.id === state.activeChatId ? 'active' : ''}" data-id="${friend.id}">
              <div class="avatar-stack">
                <div class="avatar ${friend.members[0]?.class || ''}" style="background: ${friend.isGroup ? 'linear-gradient(135deg, #6366f1, #a855f7)' : getAvatarColor(friend.name)}">
                   ${friend.isGroup ? friend.avatarIcon : `<img src="/avatars_mosaic.png" alt="avatar">`}
                </div>
                ${friend.status === 'Online' ? '<div class="online-indicator"></div>' : ''}
              </div>
              <div class="user-info">
                <div class="name-row">
                  <span class="name">${friend.name}</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="time-stamp">Recently</span>
                    <button class="remove-btn ripple" data-id="${friend.id}" title="Remove Chat">×</button>
                  </div>
                </div>
                <span class="status">${friend.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sidebar-footer">
          <div class="current-user">
            <div class="avatar" style="width: 38px; height: 38px; font-size: 14px; background: #8b5cf6">ME</div>
            <div class="user-info">
              <span class="name">Mahesh M.</span>
              <span class="status">Available</span>
            </div>
          </div>
          <button class="settings-btn ripple">⚙️</button>
        </div>
      </div>
      
      <div class="chat-area">
        ${state.friends.length > 0 ? `
        <div class="chat-header">
          <div class="chat-header-info">
            <h3 class="active-chat-name">${activeChat.name}</h3>
            <div id="typing-indicator" class="typing-indicator" style="opacity: ${state.isTyping ? '1' : '0'}">
               <span id="typing-text">${state.typingName}</span>
               <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
            <span class="chat-status" style="display: ${state.isTyping ? 'none' : 'block'}">${activeChat.status}</span>
          </div>
          <div class="header-actions">
            <div class="member-dots">
               ${activeChat.members ? activeChat.members.slice(0, 3).map(m => `
                 <div class="mini-avatar avatar ${m.class}" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid #000; margin-left: -8px;">
                   <img src="/avatars_mosaic.png" alt="m">
                 </div>`).join('') : ''}
            </div>
            <button class="header-btn ripple">📞</button>
            <button class="header-btn ripple">🎥</button>
            <button class="header-btn ripple">⋮</button>
          </div>
        </div>
        
        <div class="chat-messages" id="message-container">
           <div class="date-divider"><span>Today</span></div>
          ${state.messages.filter(m => m.chatId === state.activeChatId).map(msg => `
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
                  <div class="reaction ripple" data-emoji="${emoji}" data-msg-id="${msg.id}">
                    <span>${emoji}</span>
                    <span class="reaction-count">${count}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="input-area">
          <div class="smart-replies-container" id="smart-replies" style="display: ${state.messages.length > 5 ? 'none' : 'flex'}">
            ${state.smartReplies.map(reply => `<button class="smart-reply ripple">${reply}</button>`).join('')}
          </div>
          <form class="input-wrapper" id="chat-form">
            <button type="button" class="action-btn">📎</button>
            <input type="text" placeholder="Message ${activeChat.name}..." id="message-input" autocomplete="off">
            <button type="button" class="action-btn">😊</button>
            <button type="submit" class="send-btn ripple">
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
      state.activeChatId = parseInt(item.dataset.id);
      renderApp();
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      state.friends = state.friends.filter(f => f.id !== id);
      if (state.activeChatId === id && state.friends.length > 0) state.activeChatId = state.friends[0].id;
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
          avatarIcon: name.substring(0, 2).toUpperCase(),
          status: 'Online',
          isGroup: false,
          members: [{ name: name, color: getAvatarColor(name), class: '' }]
        };
        state.friends.push(newChat);
        state.activeChatId = newChat.id;
        renderApp();
      }
    });
  }

  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#message-input');

  const sendMessage = (text) => {
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: Date.now(),
      chatId: state.activeChatId,
      sender: 'You',
      text,
      time,
      status: 'sent',
      reactions: {}
    };

    state.messages.push(newMessage);
    if (input) input.value = '';
    renderApp();

    // Simulate delievery and seen
    setTimeout(() => {
      newMessage.status = 'delivered';
      renderApp();
      setTimeout(() => {
        newMessage.status = 'seen';
        renderApp();
        simulateReplies();
      }, 1500);
    }, 800);
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage(input.value.trim());
    });
  }

  document.querySelectorAll('.smart-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.innerText);
    });
  });

  document.querySelectorAll('.message').forEach(msgEl => {
    msgEl.addEventListener('dblclick', () => {
      const msgId = parseInt(msgEl.dataset.id);
      const msg = state.messages.find(m => m.id === msgId);
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
  const activeChat = state.friends.find(f => f.id === state.activeChatId);
  if (!activeChat || !activeChat.members) return;

  const members = activeChat.members.filter(m => m.name !== 'You');
  if (members.length === 0) return;
  const replier = members[Math.floor(Math.random() * members.length)];

  // Set Typing State
  setTimeout(() => {
    state.isTyping = true;
    state.typingName = replier.name;
    renderApp();

    const replies = [
      "That looks incredible!",
      "I agree with Sarah on this.",
      "Just sent you some feedback via email.",
      "Great work! 🚀",
      "I'm working on the assets now.",
      "Can we hop on a quick call?",
      "Looks good to me!",
      "Have you tested it on mobile?",
      "Perfect. I'll update the Trello board.",
      "Wait, Sarah, did you see my last comment?"
    ];

    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const typingDuration = Math.min(Math.max(replyText.length * 40, 1500), 4000);

    setTimeout(() => {
      const msg = {
        id: Date.now(),
        chatId: state.activeChatId,
        sender: replier.name,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: replier.color,
        senderClass: replier.class,
        reactions: {}
      };

      if (state.activeChatId === msg.chatId) {
        state.messages.push(msg);
        state.isTyping = false;
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
