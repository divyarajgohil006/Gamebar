document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createRoomBtn = document.getElementById('createRoomBtn');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const roomCodeInput = document.getElementById('roomCode');
    const roomLinkSection = document.getElementById('roomLink');
    const shareableLinkInput = document.getElementById('shareableLink');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const onlineList = document.getElementById('onlineList');

    // Generate a random room code
    function generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Create a new room
    createRoomBtn.addEventListener('click', function() {
        const roomCode = generateRoomCode();
        const roomLink = `${window.location.origin}/room.html?room=${roomCode}`;
        
        // Show the room link
        shareableLinkInput.value = roomLink;
        roomLinkSection.style.display = 'block';
        
        // Show success message
        showNotification('Room created! Share the link with friends.', 'success');
        
        // Store room code in localStorage
        localStorage.setItem('currentRoom', roomCode);
        localStorage.setItem('isHost', 'true');
        
        // Redirect to room after 3 seconds
        setTimeout(() => {
            window.location.href = `room.html?room=${roomCode}`;
        }, 3000);
    });

    // Join existing room
    joinRoomBtn.addEventListener('click', function() {
        const roomCode = roomCodeInput.value.trim().toUpperCase();
        
        if (!roomCode) {
            showNotification('Please enter a room code', 'error');
            return;
        }
        
        if (roomCode.length !== 6) {
            showNotification('Room code must be 6 characters', 'error');
            return;
        }
        
        // Store in localStorage
        localStorage.setItem('currentRoom', roomCode);
        localStorage.setItem('isHost', 'false');
        
        // Redirect to room
        window.location.href = `room.html?room=${roomCode}`;
    });

    // Copy link to clipboard
    copyLinkBtn.addEventListener('click', function() {
        shareableLinkInput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyLinkBtn.style.background = '#43b581';
        
        setTimeout(() => {
            copyLinkBtn.innerHTML = originalText;
            copyLinkBtn.style.background = '';
        }, 2000);
        
        showNotification('Link copied to clipboard!', 'success');
    });

    // Allow Enter key to join room
    roomCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinRoomBtn.click();
        }
    });

    // Simulate online users updating
    function updateOnlineUsers() {
        const statuses = ['Playing Valorant', 'In Lobby', 'Available', 'In Game', 'AFK'];
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan'];
        
        // Clear current list
        onlineList.innerHTML = '';
        
        // Generate 3-6 random online users
        const numUsers = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < numUsers; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            const userDiv = document.createElement('div');
            userDiv.className = 'user';
            userDiv.innerHTML = `<i class="fas fa-user"></i> ${name} - ${status}`;
            
            onlineList.appendChild(userDiv);
        }
    }

    // Update online users every 30 seconds
    updateOnlineUsers();
    setInterval(updateOnlineUsers, 30000);

    // Notification system
    function showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '10px';
        notification.style.background = type === 'success' ? '#43b581' : '#f04747';
        notification.style.color = 'white';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});