import React, { useState, useEffect, useRef } from 'react';
import { selectUser } from '../../features/userSlice';
import { useSelector } from 'react-redux';

const ChatRoom = () => {
    const user = useSelector(selectUser);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        // ws.current = new WebSocket('ws://localhost:80');
        ws.current = new WebSocket(process.env.REACT_APP_backendUrl);
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };
        return () => ws.current.close();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (input.trim()) {
            const message = { sender: user.displayName || user.email, text: input };
            ws.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="flex flex-col items-center h-[91vh] bg-[#121212] text-[#e0e0e0] font-sans py-6 px-4">
            <div className="flex flex-col w-full max-w-xl mb-6">
                <p className="text-lg font-semibold mb-2">RULES TO FOLLOW IN THIS CHAT ROOM</p>
                <span className="text-sm">1. Be civil and courteous</span>
                <span className="text-sm">2. Do not spam messages</span>
                <span className="text-sm">3. Ask coding related questions only</span>
                <span className="text-sm">4. Violators will be banned permanently</span>
            </div>

            <div className="w-full max-w-xl h-[300px] overflow-y-scroll bg-[#1e1e1e] border border-[#333] rounded-lg p-4 mb-6 space-y-2">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong className="text-[#6200ea]">{msg.sender}:</strong> <span>{msg.text}</span>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="w-full max-w-xl flex mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded-lg px-4 py-2 outline-none"
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-3 px-5 py-2 rounded-lg bg-[#6200ea] hover:bg-[#4b00b5] text-white transition-colors"
                >
                    Send
                </button>
            </div>

            <div className="flex flex-col items-center w-full max-w-xl">
                <p className="text-lg font-semibold mb-2">Points to Remember</p>
                <span className="text-sm text-center">
                    1. History is not saved, i.e. as soon as you leave the chat room, all your messages will be deleted
                </span>
                <span className="text-sm text-center">
                    2. Press enter or click send button to send messages
                </span>
                <span className="text-sm text-center">
                    3. Respect every user's privacy
                </span>
            </div>
        </div>
    );
};

export default ChatRoom;
