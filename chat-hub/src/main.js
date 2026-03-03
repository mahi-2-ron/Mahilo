import './style.css'

const app = document.querySelector('#app')

// Global State to survive re-renders
const state = {
  activeChatId: 1,
  isTyping: false,
  typingName: '',
  searchQuery: '',
  showInfoPanel: false,
  replyingTo: null,
  currentTheme: 'default',
  smartReplies: ["Sounds good!", "I'll check it out.", "Perfect!", "Can't wait!", "Tell me more."],
  stories: [
    { id: 1, name: 'You', avatar: 'MY', color: '#8b5cf6' },
    { id: 2, name: 'Alex', avatar: 'AR', color: '#3b82f6' },
    { id: 3, name: 'Sarah', avatar: 'SC', color: '#10b981' },
    { id: 4, name: 'Maya', avatar: 'MK', color: '#ec4899' },
    { id: 5, name: 'Jamie', avatar: 'JW', color: '#f59e0b' },
  ],
  friends: [
    {
      id: 1, name: 'Design Squad', avatarIcon: 'DS', status: '5 active members', isGroup: true,
      bio: 'Official channel for the design team. No memes allowed except on Fridays.',
      members: [
        { name: 'Alex', color: '#3b82f6', class: 'alex' },
        { name: 'Sarah', color: '#10b981', class: 'sarah' },
        { name: 'Jamie', color: '#f59e0b', class: 'jamie' },
        { name: 'Maya', color: '#ec4899', class: 'maya' }
      ]
    },
    { id: 2, name: 'Alex Rivera', avatarIcon: 'AR', status: 'Online', isGroup: false, bio: 'Product Designer @ ChatHub. ☕ Coffee and Pixels.', members: [{ name: 'Alex', color: '#3b82f6', class: 'alex' }] },
    { id: 3, name: 'Sarah Chen', avatarIcon: 'SC', status: 'Away', isGroup: false, bio: 'iOS dev. Building the future one line at a time.', members: [{ name: 'Sarah', color: '#10b981', class: 'sarah' }] },
    {
      id: 4, name: 'Project Alpha', avatarIcon: 'PA', status: '3 members', isGroup: true,
      bio: 'Highly classified project. Top secret stuff.',
      members: [
        { name: 'Alex', color: '#3b82f6', class: 'alex' },
        { name: 'Jamie', color: '#f59e0b', class: 'jamie' }
      ]
    },
  ],
  messages: [
    { id: 1, chatId: 1, sender: 'Alex', text: 'Hey team! Anyone had a chance to look at the new mockups?', time: '10:30 AM', color: '#3b82f6', reactions: { '🔥': 2 }, senderClass: 'alex' },
    { id: 2, chatId: 1, sender: 'Sarah', text: 'Checking them now. The typography feels much better.', time: '10:32 AM', color: '#10b981', reactions: {}, senderClass: 'sarah' },
    { id: 5, chatId: 1, sender: 'Jamie', type: 'voice', duration: '0:12', time: '10:34 AM', color: '#f59e0b', reactions: {}, senderClass: 'jamie' },
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
  const filteredFriends = state.friends.filter(f =>
    f.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const activeChat = state.friends.find(f => f.id === state.activeChatId) || state.friends[0] || { name: 'Chat Hub', status: 'No chats', id: 0, members: [] };

  document.documentElement.setAttribute('data-theme', state.currentTheme);

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
        
        <div class="search-container">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" id="sidebar-search" placeholder="Search chats..." value="${state.searchQuery}">
          </div>
        </div>

        <div class="stories-container">
          ${state.stories.map(s => `
            <div class="story-item">
              <div class="story-ring">
                <div class="story-avatar" style="background: ${s.color}">${s.avatar}</div>
              </div>
              <span class="story-name">${s.name}</span>
            </div>
          `).join('')}
        </div>

        <div class="user-list">
          ${filteredFriends.map(friend => `
            <div class="user-item ${friend.id === state.activeChatId ? 'active' : ''}" data-id="${friend.id}">
              <div class="avatar-stack">
                <div class="avatar" style="background: ${friend.isGroup ? 'var(--gradient)' : getAvatarColor(friend.name)}">
                   ${friend.isGroup ? friend.avatarIcon : friend.name.substring(0, 2).toUpperCase()}
                </div>
                ${friend.status === 'Online' ? '<div class="online-indicator"></div>' : ''}
              </div>
              <div class="user-info">
                <div class="name-row">
                  <span class="name">${friend.name}</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="time-stamp">Recently</span>
                    <button class="remove-btn ripple" data-id="${friend.id}">×</button>
                  </div>
                </div>
                <span class="status">${friend.status}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="theme-options">
           <div class="theme-dot dot-default ${state.currentTheme === 'default' ? 'selected' : ''}" data-theme="default"></div>
           <div class="theme-dot dot-emerald ${state.currentTheme === 'emerald' ? 'selected' : ''}" data-theme="emerald"></div>
           <div class="theme-dot dot-sunset ${state.currentTheme === 'sunset' ? 'selected' : ''}" data-theme="sunset"></div>
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
                 <div class="mini-avatar avatar" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid #000; margin-left: -8px; background: ${m.color}">
                    ${m.name.charAt(0)}
                 </div>`).join('') : ''}
            </div>
            <button class="header-btn ripple" id="toggle-info">ℹ️</button>
            <button class="header-btn ripple">📞</button>
            <button class="header-btn ripple">🎥</button>
          </div>
        </div>
        
        <div class="chat-messages" id="message-container">
           <div class="date-divider"><span>Today</span></div>
          ${state.messages.filter(m => m.chatId === state.activeChatId).map(msg => `
            <div class="message-wrapper ${msg.sender === 'You' ? 'sent' : 'received'}" style="animation: fadeInUp 0.3s ease-out">
              ${msg.sender !== 'You' ? `<span class="sender-name" style="color: ${msg.color || '#94a3b8'}">${msg.sender}</span>` : ''}
              <div class="message" data-id="${msg.id}">
                <div class="reaction-picker">
                   <span class="picker-emoji" data-msg-id="${msg.id}">❤️</span>
                   <span class="picker-emoji" data-msg-id="${msg.id}">🔥</span>
                   <span class="picker-emoji" data-msg-id="${msg.id}">😂</span>
                   <span class="picker-emoji" data-msg-id="${msg.id}">👍</span>
                   <span class="picker-emoji" data-msg-id="${msg.id}">😮</span>
                </div>
                ${msg.replyTo ? `
                   <div class="quoted-message">
                      <strong>${msg.replyTo.user}</strong><br>
                      ${msg.replyTo.text.length > 30 ? msg.replyTo.text.substring(0, 30) + '...' : msg.replyTo.text}
                   </div>
                ` : ''}
                ${msg.type === 'voice' ? `
                  <div class="voice-message">
                    <button class="play-btn">▶</button>
                    <div class="waveform">
                       <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                       <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                       <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                    </div>
                    <span>${msg.duration}</span>
                  </div>
                ` : msg.type === 'image' ? `
                   <img src="${msg.src}" class="image-message" alt="shared image">
                   <div class="text">${msg.text || ''}</div>
                ` : `
                   <div class="text">${msg.text}</div>
                `}
                <div class="message-info">
                  ${msg.time} 
                  ${msg.sender === 'You' ? `
                    <span class="read-receipt seen">✓✓</span>
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
          <div class="reply-preview ${state.replyingTo ? 'active' : ''}">
             <div class="reply-content">
                <div class="reply-user">Replying to ${state.replyingTo?.sender}</div>
                <div style="opacity: 0.6">${state.replyingTo?.text || 'Voice/Image Contact'}</div>
             </div>
             <button class="remove-btn" id="cancel-reply">×</button>
          </div>
          <div class="smart-replies-container" id="smart-replies" style="display: ${state.messages.filter(m => m.chatId === state.activeChatId).length > 8 ? 'none' : 'flex'}">
            ${state.smartReplies.map(reply => `<button class="smart-reply ripple">${reply}</button>`).join('')}
          </div>
          <form class="input-wrapper" id="chat-form">
            <button type="button" class="action-btn" id="attach-btn" title="Send Image">🖼️</button>
            <input type="text" placeholder="Message ${activeChat.name}..." id="message-input" autocomplete="off">
            <button type="button" class="action-btn" id="voice-btn" title="Record Voice">🎤</button>
            <button type="submit" class="send-btn ripple">
               <span class="send-icon">↗</span>
            </button>
          </form>
        </div>
        ` : 'Select a Chat'}
      </div>

      <div class="info-sidebar ${state.showInfoPanel ? 'active' : ''}">
        <div class="info-header">
           <div class="big-avatar" style="background: ${activeChat.isGroup ? 'var(--gradient)' : getAvatarColor(activeChat.name)}">
             ${activeChat.name.charAt(0)}
           </div>
           <div class="info-details">
             <h3>${activeChat.name}</h3>
             <p>${activeChat.isGroup ? activeChat.status : 'Product Designer'}</p>
           </div>
        </div>
        <div style="padding: 0 20px;">
           <h4 style="font-size: 11px; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">About</h4>
           <p style="font-size: 14px; line-height: 1.5; color: #94a3b8;">${activeChat.bio || 'Official channel for the design team. Join the conversation!'}</p>
        </div>
        <div style="margin-top: 30px;">
           <h4 style="padding: 0 20px; font-size: 11px; color: #475569; margin-bottom: 12px; text-transform: uppercase;">Shared Media</h4>
           <div class="media-grid">
              <div class="media-item"><img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&q=80"></div>
              <div class="media-item"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&q=80"></div>
              <div class="media-item"><img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&q=80"></div>
           </div>
        </div>
      </div>
    </div>
  `

  attachEvents();
  scrollToBottom();
}

function attachEvents() {
  // Chat item selection
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', () => {
      state.activeChatId = parseInt(item.dataset.id);
      state.replyingTo = null;
      renderApp();
    });
  });

  // Search
  const searchInput = document.querySelector('#sidebar-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderApp();
      document.querySelector('#sidebar-search').focus();
    });
  }

  // Remove Chat
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      state.friends = state.friends.filter(f => f.id !== id);
      if (state.activeChatId === id && state.friends.length > 0) state.activeChatId = state.friends[0].id;
      renderApp();
    });
  });

  // Add Chat
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

  // Info Sidebar Toggle
  document.querySelector('#toggle-info')?.addEventListener('click', () => {
    state.showInfoPanel = !state.showInfoPanel;
    renderApp();
  });

  // Theme Switching
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      state.currentTheme = dot.dataset.theme;
      renderApp();
    });
  });

  // Reactions & Reply Shortcut
  document.querySelectorAll('.message').forEach(msgEl => {
    msgEl.addEventListener('click', (e) => {
      const picker = msgEl.querySelector('.reaction-picker');
      if (picker) {
        document.querySelectorAll('.reaction-picker').forEach(p => p !== picker && p.classList.remove('active'));
        picker.classList.toggle('active');
      }
    });

    // Right-click to reply
    msgEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const msgId = parseInt(msgEl.dataset.id);
      state.replyingTo = state.messages.find(m => m.id === msgId);
      renderApp();
    });
  });

  // Cancel Reply
  document.querySelector('#cancel-reply')?.addEventListener('click', () => {
    state.replyingTo = null;
    renderApp();
  });

  // Send Message
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#message-input');

  const sendMessage = (text, type = 'text', additional = {}) => {
    if (!text && type === 'text') return;

    const newMessage = {
      id: Date.now(),
      chatId: state.activeChatId,
      sender: 'You',
      text,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      reactions: {},
      replyTo: state.replyingTo ? { user: state.replyingTo.sender, text: state.replyingTo.text || 'Media Contact' } : null,
      ...additional
    };

    state.messages.push(newMessage);
    state.replyingTo = null;
    if (input) input.value = '';
    renderApp();
    setTimeout(() => simulateReplies(), 1500);
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage(input.value.trim());
    });
  }

  // Image Upload Mock
  document.querySelector('#attach-btn')?.addEventListener('click', () => {
    sendMessage('Look at this workspace!', 'image', { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' });
  });

  // Voice Note Mock
  document.querySelector('#voice-btn')?.addEventListener('click', () => {
    state.isTyping = true;
    state.typingName = 'You are recording...';
    renderApp();
    setTimeout(() => {
      sendMessage(null, 'voice', { duration: '0:07' });
      state.isTyping = false;
      renderApp();
    }, 2000);
  });

  // Reaction Picker Logic
  document.querySelectorAll('.picker-emoji').forEach(emojiEl => {
    emojiEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const msgId = parseInt(emojiEl.dataset.msgId);
      const msg = state.messages.find(m => m.id === msgId);
      if (msg) {
        msg.reactions[emojiEl.innerText] = (msg.reactions[emojiEl.innerText] || 0) + 1;
        renderApp();
      }
    });
  });

  // Voice playback simulation
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = btn.closest('.voice-message');
      container.classList.toggle('playing');
      btn.innerText = container.classList.contains('playing') ? '⏸' : '▶';
    });
  });
}

function simulateReplies() {
  const activeChat = state.friends.find(f => f.id === state.activeChatId);
  if (!activeChat || !activeChat.members) return;
  const replier = activeChat.members[Math.floor(Math.random() * activeChat.members.length)];

  state.isTyping = true;
  state.typingName = replier.name;
  renderApp();

  setTimeout(() => {
    const msg = {
      id: Date.now(),
      chatId: state.activeChatId,
      sender: replier.name,
      text: "This definitely looks like a premium feature! 🚀",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: replier.color,
      reactions: {}
    };
    state.messages.push(msg);
    state.isTyping = false;
    renderApp();
  }, 2000);
}

function scrollToBottom() {
  const el = document.querySelector('#message-container');
  if (el) el.scrollTop = el.scrollHeight;
}

renderApp();
