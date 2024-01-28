import React, { useState, useRef, useEffect, Fragment } from "react";
import "./index.css";
import axios from "axios";

const config = {
  headers: {
    "x-api-key": "sec_Lt8qoerJAwjyx8mCshdpx1kyrErDYtmI",
    "Content-Type": "application/json",
  },
};

const ChatGptInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const chatContainerRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    // Add user input to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);

    // Reset error state and set loading state
    setError(null);
    setIsLoading(true);

    const data = {
      sourceId: "cha_Ff3uRZwaR81J0H8tbi2CH",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    };

    axios
    .post("https://api.chatpdf.com/v1/chats/message", data, config)
    .then((response) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response.data.content },
      ]);

      // Clear input field and currentAssistantMessage
      setInput("");
      setCurrentAssistantMessage("");
    })
    .catch((error) => {
      setError("Failed to fetch response. Please try again: " + error.message);
    })
    .finally(() => {
      setIsLoading(false);
    })
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentAssistantMessage]);

  const renderMessageContent = (content) => {
    const parts = content.split("\n");
    return parts.map((part, index) => (
      <Fragment key={index}>
        {part}
        {index < parts.length - 1 && <br />}
      </Fragment>
    ));
  };

  return (
    <div className="chat-page">
      <div className="chat-container" ref={chatContainerRef}>
        <div className="chat-messages">
          {/* Render user input and chatbot responses */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              <span className="message-role">
                {message.role === "user" ? "You" : "Bot"}:
              </span>
              <span className="message-content">
                {renderMessageContent(message.content)}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message assistant-message">
              <span className="message-role">Bot:</span>
              <span className="message-content">
                {renderMessageContent(currentAssistantMessage)}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="chat-input">
        {/* Render input field and submit button */}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={!input || isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
      {/* Render error message if there's an error */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ChatGptInterface;
