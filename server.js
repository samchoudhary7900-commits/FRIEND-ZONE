/**
 * ============================================================================
 * FRIEND ZONE APP - ULTIMATE MASTER BACKEND SERVER (v3.0)
 * Architecture: Node.js, Express, Socket.io, WebRTC Signaling Hub
 * ============================================================================
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== GLOBAL IN-MEMORY STORAGE ====================
let registeredUsers = new Map(); // socketId -> User Object
let activeVoiceRooms = new Map(); // roomId -> Room Object

// Initialize default Friend Zone VIP Voice Lounge #1
activeVoiceRooms.set("room_friend_zone_1", {
    id: "room_friend_zone_1",
    title: "✨ Friend Zone VIP Voice Lounge #1",
    host: "Admin",
    category: "Voice Party",
    seats: {
        1: { socketId: null, username: "Host (Reserved)", muted: false, occupied: false, avatar: "👑" },
        2: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" },
        3: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" },
        4: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" },
        5: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" },
        6: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" },
        7: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" },
        8: { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" }
    },
    messages: [
        { sender: "System", message: "Welcome to Friend Zone Live Voice Lounge!", time: new Date().toLocaleTimeString() }
    ]
});

// ==================== SOCKET.IO CONNECTION & EVENT ROUTING ====================
io.on('connection', (socket) => {
    console.log(`⚡ [Connection Established] Socket ID: ${socket.id}`);

    // 1. User Handshake & Profile Initialization
    socket.on('user-handshake', ({ username, avatar }) => {
        let cleanUsername = username || `User_${Math.floor(Math.random() * 90000 + 10000)}`;
        let userProfile = {
            socketId: socket.id,
            username: cleanUsername,
            avatar: avatar || '👤',
            coins: 5000,
            vipLevel: 5,
            popularity: 1200,
            currentRoom: null
        };

        registeredUsers.set(socket.id, userProfile);
        socket.emit('handshake-success', userProfile);
        console.log(`👤 [User Registered] ${cleanUsername} (${socket.id})`);
    });

    // 2. Fetch Active Rooms List
    socket.on('get-rooms-list', () => {
        let roomsArray = Array.from(activeVoiceRooms.values());
        socket.emit('rooms-list-response', roomsArray);
    });

    // 3. Join Voice Room & Occupy Seat
    socket.on('join-voice-room', ({ roomId, seatNum }) => {
        let room = activeVoiceRooms.get(roomId);
        let user = registeredUsers.get(socket.id);

        if (!room || !user) {
            socket.emit('error-notice', { message: "Room or User session not found!" });
            return;
        }

        // Leave previous socket room if any
        if (user.currentRoom && user.currentRoom !== roomId) {
            socket.leave(user.currentRoom);
            removeUserFromRoomSeats(user.currentRoom, socket.id);
        }

        socket.join(roomId);
        user.currentRoom = roomId;

        // Seat assignment logic
        if (seatNum && room.seats[seatNum] && !room.seats[seatNum].occupied) {
            // Clear user from any other seat in this room first
            Object.keys(room.seats).forEach(s => {
                if (room.seats[s].socketId === socket.id) {
                    room.seats[s] = { socketId: null, username: "Empty Seat", muted: true, occupied: false, avatar: "💺" };
                }
            });

            room.seats[seatNum] = {
                socketId: socket.id,
                username: user.username,
                muted: false,
                occupied: true,
                avatar: user.avatar
            };
        }

        // Broadcast room state update to all participants in this room
        io.to(roomId).emit('room-state-update', room);
        console.log(`🎧 [Voice Room Joined] ${user.username} entered ${roomId}`);
    });

    // 4. WebRTC Signaling Hub (P2P Audio Bridge)
    socket.on('webrtc-offer', ({ targetSocketId, offer }) => {
        socket.to(targetSocketId).emit('webrtc-offer', {
            offer: offer,
            senderSocketId: socket.id
        });
    });

    socket.on('webrtc-answer', ({ targetSocketId, answer }) => {
        socket.to(targetSocketId).emit('webrtc-answer', {
            answer: answer,
            senderSocketId: socket.id
        });
    });

    socket.on('webrtc-ice-candidate', ({ targetSocketId, candidate }) => {
        socket.to(targetSocketId).emit('webrtc-ice-candidate', {
            candidate: candidate,
            senderSocketId: socket.id
        });
    });

    // 5. Microphone Mute / Unmute Synchronization
    socket.on('toggle-mic-status', ({ roomId, seatNum, muted }) => {
        let room = activeVoiceRooms.get(roomId);
        if (room && room.seats[seatNum] && room.seats[seatNum].socketId === socket.id) {
            room.seats[seatNum].muted = muted;
            io.to(roomId).emit('room-state-update', room);
        }
    });

    // 6. Gift Sending & Coin Deduction Transaction
    socket.on('send-virtual-gift', ({ roomId, giftName, cost, recipientSeat }) => {
        let sender = registeredUsers.get(socket.id);
        let room = activeVoiceRooms.get(roomId);

        if (!sender || !room) return;

        if (sender.coins >= cost) {
            sender.coins -= cost;
            socket.emit('wallet-balance-update', { coins: sender.coins });

            let recipientName = room.seats[recipientSeat] ? room.seats[recipientSeat].username : "Room Host";

            let giftBroadcastObj = {
                sender: sender.username,
                recipient: recipientName,
                gift: giftName,
                message: `🎁 ${sender.username} sent a grand ${giftName} to ${recipientName}!`
            };

            room.messages.push({ sender: "System", message: giftBroadcastObj.message, time: new Date().toLocaleTimeString() });
            io.to(roomId).emit('gift-animation-broadcast', giftBroadcastObj);
            io.to(roomId).emit('room-chat-broadcast', { sender: "System", message: giftBroadcastObj.message, time: new Date().toLocaleTimeString() });
        } else {
            socket.emit('error-notice', { message: "❌ Insufficient coins in your Friend Zone wallet!" });
        }
    });

    // 7. Real-Time Room Chat Messaging
    socket.on('send-room-chat-msg', ({ roomId, message }) => {
        let user = registeredUsers.get(socket.id);
        let room = activeVoiceRooms.get(roomId);

        if (user && room && message.trim() !== "") {
            let chatObj = {
                sender: user.username,
                message: message.trim(),
                time: new Date().toLocaleTimeString()
            };
            room.messages.push(chatObj);
            io.to(roomId).emit('room-chat-broadcast', chatObj);
        }
    });

    // 8. Ludo Game Sync & Dice Roll
    socket.on('ludo-roll-dice-action', ({ roomId, color }) => {
        let rolledValue = Math.floor(Math.random() * 6) + 1;
        io.to(roomId).emit('ludo-dice-rolled-broadcast', { color, rolledValue });
    });

    // 9. Disconnect Cleanup Handler
    socket.on('disconnect', () => {
        let user = registeredUsers.get(socket.id);
        if (user && user.currentRoom) {
            removeUserFromRoomSeats(user.currentRoom, socket.id);
            let room = activeVoiceRooms.get(user.currentRoom);
            if (room) {
                io.to(user.currentRoom).emit('room-state-update', room);
            }
        }
        registeredUsers.delete(socket.id);
        console.log(`❌ [User Disconnected]: ${socket.id}`);
    });
});

// Helper function to clear seats when a user disconnects or switches rooms
function removeUserFromRoomSeats(roomId, socketId) {
    let room = activeVoiceRooms.get(roomId);
    if (!room) return;

    Object.keys(room.seats).forEach(seatKey => {
        if (room.seats[seatKey].socketId === socketId) {
            room.seats[seatKey] = {
                socketId: null,
                username: "Empty Seat",
                muted: true,
                occupied: false,
                avatar: "💺"
            };
        }
    });
}

// ==================== START HTTP & WEBSOCKET SERVER ====================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 [Friend Zone Master Server] Running seamlessly on http://localhost:${PORT}`);
});
                                     
