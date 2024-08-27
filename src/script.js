const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username');
const usernameSection = document.getElementById('username-section');
const chatSection = document.getElementById('chat-section');
const usersList = document.getElementById('users');
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.querySelector('.toggle-btn');  // Updated selector

// Function to update the user list in the sidebar
function updateUserList(usernames) {
    usersList.innerHTML = ''; // Clear current list
    usernames.forEach(username => {
        const item = document.createElement('li');
        item.textContent = username;
        usersList.appendChild(item);
    });
}

// Function to scroll to the bottom of the messages
function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}

// Handle new chat message
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = `${msg.username}: ${msg.text}`;
    messages.appendChild(item);
    scrollToBottom(); // Scroll to the bottom when a new message is added
});

// Handle user joining
socket.on('user joined', (username) => {
    const item = document.createElement('li');
    item.textContent = `${username} joined the chat`;
    item.style.fontStyle = 'italic';
    messages.appendChild(item);
    scrollToBottom(); // Scroll to the bottom when a user joins
    socket.emit('request user list'); // Request updated user list
});

// Handle user leaving
socket.on('user left', (username) => {
    const item = document.createElement('li');
    item.textContent = `${username} left the chat`;
    item.style.fontStyle = 'italic';
    messages.appendChild(item);
    scrollToBottom(); // Scroll to the bottom when a user leaves
    socket.emit('request user list'); // Request updated user list
});

// Handle user list update
socket.on('user list', (usernames) => {
    updateUserList(usernames);
});

// Handle username form submission
usernameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        socket.emit('user join', username);
        usernameSection.style.display = 'none';
        chatSection.style.display = 'flex';
        input.focus();
    }
});

// Handle chat form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim(); // Use the username from the input
    if (input.value && username) {
        socket.emit('chat message', { username, text: input.value });
        input.value = '';
        scrollToBottom(); // Scroll to the bottom after sending a message
    }
});

// Handle sidebar toggle
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
    if (sidebar.classList.contains('visible')) {
        document.getElementById('main-content').classList.add('shifted');
        //toggleBtn.style.left = '225px'; // Adjust button position when sidebar is visible
    } else {
        document.getElementById('main-content').classList.remove('shifted');
        //toggleBtn.style.left = '25px'; // Reset button position when sidebar is hidden
    }
});
