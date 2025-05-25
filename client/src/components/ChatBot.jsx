import { useState, useRef, useEffect } from 'react';
import api from '../utils/axios';

export default function ChatBot({ shopId, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.get(`http://localhost:8080/api/chatAI`, {
        params: {
          shopId: shopId,
          query: userMessage
        }
      });

      let botResponse = '';
      if (response.data?.response) {
        botResponse = response.data.response;
      } else if (typeof response.data === 'string') {
        botResponse = response.data;
      } else {
        botResponse = JSON.stringify(response.data);
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: botResponse || 'No response received'
      }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `Error: ${error.response?.data?.message || error.message || 'Failed to get response'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-white shadow-xl flex flex-col border-r border-gray-200">
      {/* Chat Header */}
      <div className="flex-none bg-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-white/75">Connected to Shop ID: {shopId || 'None'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/75 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 my-4">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="mt-2 font-medium">Start a conversation</p>
              <p className="text-sm">Ask about sales forecasts, trends, or recommendations.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white shadow-sm border border-gray-200'
                }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {message.type === 'user' ? 'You' : message.type === 'error' ? 'Error' : 'AI Assistant'}
                </div>
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="flex-none border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              disabled={isLoading || !shopId}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim() || !shopId}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Send
            </button>
          </div>
          {!shopId && (
            <p className="text-sm text-red-500 mt-2">Please select a shop to start chatting</p>
          )}
        </form>
      </div>
    </div>
  );
} 