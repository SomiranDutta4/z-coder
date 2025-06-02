import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';
import { selectUser } from '../../features/userSlice';
import { useSelector } from 'react-redux';

const ChatRoom = () => {
    const user = useSelector(selectUser);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        // Connect to WebSocket server
        ws.current = new WebSocket('ws://localhost:80');

        // Handle incoming messages
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        // Clean up WebSocket connection
        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            const message = { sender: user.displayName || user.email, text: input };
            ws.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="chat-room">
            <div className='rules'>
                <p>
                    RULES TO FOLLOW IN THIS CHAT ROOM
                </p>
                <span>1. Be civil and courteuos</span>
                <span>2. Do not spam messages</span>
                <span>3. Ask coding related questions only</span>
                <span>4. Violators will banned permanently</span>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className='points'>
                <p>
                    Points to Remember
                </p>
                <span>1. History is not saved, i.e. as soon as you leave chat room, all your messages will be deleted</span>
                <span>2. Press enter or click send button to send messages</span>
                <span>3. Respect every user's privacy</span>
            </div>
        </div>
    );
};

export default ChatRoom;
