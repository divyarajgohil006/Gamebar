document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const roomCodeDisplay = document.getElementById('roomCodeDisplay');
    const leaveRoomBtn = document.getElementById('leaveRoomBtn');
    const muteBtn = document.getElementById('muteBtn');
    const deafenBtn = document.getElementById('deafenBtn');
    const participantsList = document.getElementById('participantsList');
    const addGameBtn = document.getElementById('addGameBtn');
    const gameUrlInput = document.getElementById('gameUrl');
    const gameNameInput = document.getElementById('gameName');
    const gamesList = document.getElementById('gamesList');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    // Get room code from URL
    const urlParams = new URLSearchParams(window.location.search);
    let roomCode = urlParams.get('room');
    const isHost = localStorage.getItem('isHost') === 'true';

    // If no room code in URL, try localStorage
    if (!roomCode) {
        roomCode = localStorage.getItem('currentRoom');
        if (!roomCode) {
            alert('No room specified. Redirecting to home...');
            window.location.href = 'index.html';
            return;
        }
    }

    // Display room code
    roomCodeDisplay.textContent = `Room Code: ${roomCode} ${isHost ? '(Host)' : ''}`;

    // Leave room button
    leaveRoomBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to leave the room?')) {
            localStorage.removeItem('currentRoom');
            localStorage.removeItem('isHost');
            window.location.href = 'index.html';
        }
    });

    // Voice controls
    let isMuted = false;
    let isDeafened = false;

    muteBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        muteBtn.innerHTML = `<i class="fas fa-microphone${isMuted ? '-slash' : ''}"></i> ${isMuted ? 'Unmute' : 'Mute'}`;
        muteBtn.style.background = isMuted ? '#f04747' : '#43b581';
        
        // In a real app, this would control actual microphone
        showChatMessage('system', `You ${isMuted ? 'muted' : 'unmuted'} your microphone`);
    });

    deafenBtn.addEventListener('click', function() {
        isDeafened = !isDeafened;
        deafenBtn.innerHTML = `<i class="fas fa-headphones${isDeafened ? '-slash' : ''}"></i> ${isDeafened ? 'Undeafen' : 'Deafen'}`;
        deafenBtn.style.background = isDeafened ? '#f04747' : '#43b581';
        
        showChatMessage('system', `You ${isDeafened ? 'deafened' : 'undeafened'} yourself`);
    });

    // Add participants (simulated)
    function addParticipant(name, isHost = false) {
        const participant = document.createElement('div');
        participant.className = 'participant';
        participant.innerHTML = `
            <i class="fas fa-user"></i> ${name} ${isHost ? '(Host)' : ''}
        `;
        participantsList.appendChild(participant);
    }

    // Simulate other users joining
    function simulateUsers() {
        const fakeUsers = ['Alex', 'Sam', 'Jordan'];
        
        // Add self first
        addParticipant('You', isHost);
        
        // Add fake users after delay
        let delay = 1000;
        fakeUsers.forEach((user, index) => {
            setTimeout(() => {
                addParticipant(user);
                showChatMessage('system', `${user} joined the room`);
            }, delay);
            delay += 1500;
        });
    }

    // Add game to list
    addGameBtn.addEventListener('click', function() {
        const url = gameUrlInput.value.trim();
        const name = gameNameInput.value.trim();
        
        if (!url || !name) {
            alert('Please enter both game name and URL');
            return;
        }
        
        // Validate URL
        if (!url.startsWith('http')) {
            alert('Please enter a valid URL (starting with http:// or https://)');
            return;
        }
        
        addGameToList(name, url);
        
        // Clear inputs
        gameUrlInput.value = '';
        gameNameInput.value = '';
        
        // Notify in chat
        showChatMessage('system', `Added ${name} to game list`);
    });

    function addGameToList(name, url) {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';
        gameItem.innerHTML = `
            <div class="game-info">
                <h4>${name}</h4>
                <p>${url}</p>
            </div>
            <button class="btn-play" onclick="window.open('${url}', '_blank')">
                <i class="fas fa-play"></i> Join
            </button>
        `;
        gamesList.appendChild(gameItem);
    }

    // Chat functionality
    function showChatMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (sender === 'system') {
            messageDiv.textContent = message;
        } else {
            messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        }
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        showChatMessage('You', message);
        chatInput.value = '';
        
        // Simulate responses
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            setTimeout(() => {
                const responses = ['Hi there!', 'Hello! Ready to play?', 'Hey!'];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                showChatMessage('Alex', randomResponse);
            }, 1000);
        }
    }

    // Add some default games
    function addDefaultGames() {
        const defaultGames = [
            { name: 'Valorant', url: 'https://playvalorant.com' },
            { name: 'Among Us', url: 'https://www.innersloth.com/games/among-us/' },
            { name: 'Minecraft', url: 'https://www.minecraft.net' }
        ];
        
        defaultGames.forEach(game => {
            addGameToList(game.name, game.url);
        });
    }

    // Initialize
    simulateUsers();
    addDefaultGames();
    
    // Welcome message
    setTimeout(() => {
        showChatMessage('system', `Welcome to Room ${roomCode}! Share game links and start playing together.`);
    }, 500);

    // Auto messages to simulate activity
    setInterval(() => {
        const messages = [
            'Anyone want to play Valorant?',
            'I\'m ready when you are!',
            'Let me know when you want to start',
            'What game should we play next?'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Only send auto messages if not recently active
        if (chatInput.value === '') {
            setTimeout(() => {
                showChatMessage('Sam', randomMessage);
            }, Math.random() * 30000); // Random delay up to 30 seconds
        }
    }, 45000); // Check every 45 seconds
});