
import React, { useState } from "react";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages([...messages, userMessage, generateResponse(input)]);
    setInput("");
  };

  const generateResponse = (message) => {
    message = message.toLowerCase();
    if (message.includes("track")) {
      return {
        from: "bot",
        text:
          "Please enter your Order ID to track. If you don't know it, visit the order page.",
      };
    }
    if (message.includes("refund")) {
      return {
        from: "bot",
        text: "Refunds usually take 5-7 business days. Please provide your order ID.",
      };
    }
    return { from: "bot", text: "Thank you for contacting us!" };
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[70%] p-3 rounded-lg text-white ${
              msg.from === "bot" ? "bg-blue-500 self-start" : "bg-green-500 self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center p-3 border-t">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
