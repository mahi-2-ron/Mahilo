import './style.css'

const app = document.querySelector('#app')

const friends = [
  { id: 1, name: 'Alex Rivera', avatar: 'AR', status: 'Online', lastMessage: 'Hey, did you see the new update?' },
  { id: 2, name: 'Sarah Chen', avatar: 'SC', status: 'Typing...', lastMessage: "I'll be there in 5 mins!" },
  { id: 3, name: 'Jamie Smith', avatar: 'JS', status: 'Offline', lastMessage: 'That looks amazing, great job!' },
  { id: 4, name: 'Maya Patel', avatar: 'MP', status: 'Online', lastMessage: "Let's chat later tonight." },
]

const messages = [
  { id: 1, sender: 'Alex', text: 'Hey there! How is the project going?', time: '10:30 AM', type: 'received' },
  { id: 2, sender: 'You', text: "It's going great! Just finished the UI architecture.", time: '10:32 AM', type: 'sent' },
  { id: 3, sender: 'Alex', text: "That's awesome! Can't wait to see it.", time: '10:33 AM', type: 'received' },
  { id: 4, sender: 'Alex', text: 'Are you using Vite?', time: '10:33 AM', type: 'received' },
  { id: 5, sender: 'You', text: "Yes! It's super fast. I even added glassmorphism.", time: '10:35 AM', type: 'sent' },
]

function renderApp() {
  app.innerHTML = `
    <div class="chat-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>Friends</h2>
        </div>
        <div class="user-list">
          ${friends.map(friend => `
            <div class="user-item ${friend.id === 1 ? 'active' : ''}">
              <div class="avatar">${friend.avatar}</div>
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
            <h3 style="font-size: 18px; color: #f8fafc;">Alex Rivera</h3>
            <span style="font-size: 12px; color: #10b981;">Online</span>
          </div>
          <div class="header-actions">
            <button style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 20px;">⋮</button>
          </div>
        </div>
        
        <div class="chat-messages" id="message-container">
          ${messages.map(msg => `
            <div class="message ${msg.type}">
              <div class="text">${msg.text}</div>
              <div class="message-info">${msg.time} ${msg.type === 'sent' ? '✓✓' : ''}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="input-area">
          <form class="input-wrapper" id="chat-form">
            <input type="text" placeholder="Type a message..." id="message-input" autocomplete="off">
            <button type="submit" class="send-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `

  const form = document.querySelector('#chat-form')
  const input = document.querySelector('#message-input')
  const container = document.querySelector('#message-container')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) return

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text,
      time,
      type: 'sent'
    }

    messages.push(newMessage)
    renderMessage(newMessage)
    input.value = ''
    container.scrollTop = container.scrollHeight

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'Alex',
        text: 'Sounds cool! 🚀',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'received'
      }
      messages.push(reply)
      renderMessage(reply)
      container.scrollTop = container.scrollHeight
    }, 1500)
  })
}

function renderMessage(msg) {
  const container = document.querySelector('#message-container')
  const div = document.createElement('div')
  div.className = `message ${msg.type}`
  div.innerHTML = `
    <div class="text">${msg.text}</div>
    <div class="message-info">${msg.time} ${msg.type === 'sent' ? '✓✓' : ''}</div>
  `
  container.appendChild(div)
}

renderApp()
