import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Aarogyam AI Assistant. I can help you with organ allocation, hospital information, and transparency data. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick action buttons
  const quickActions = [
    { text: "🏥 Hospital Login Help", action: "hospital_login" },
    { text: "📊 Transparency Data", action: "transparency" },
    { text: "🔍 Find Hospitals", action: "find_hospitals" },
    { text: "📋 Patient Status", action: "patient_status" },
    { text: "🆘 Emergency Help", action: "emergency" },
    { text: "📞 Contact Support", action: "support" }
  ];

  // Predefined responses
  const botResponses = {
    hospital_login: {
      text: "🏥 **Hospital Login Help**\n\n**Quick Login Codes:**\n• Type `aiims` for AIIMS doctor\n• Type `pgimer` for PGIMER doctor\n• Type `admin` for system admin\n• Type `doctor` for default doctor\n• Type `123` for super quick access\n\n**One-Click Login:** Use the colored buttons on the login page\n\n**Manual Login:**\n• Email: dr.sharma@aiims.edu\n• Password: Doctor@123",
      actions: ["🚀 Go to Hospital Portal", "📋 More Credentials"]
    },
    transparency: {
      text: "📊 **Transparency Dashboard Access**\n\n**Public Access:** No login required\n• URL: /transparency\n• Real-time hospital statistics\n• Organ allocation data\n• Regional performance metrics\n\n**Admin Access:**\n• Email: admin@aarogyam.gov.in\n• Password: AarogyamAdmin@2024\n• Quick code: `transparency`",
      actions: ["📊 View Dashboard", "🔐 Admin Login"]
    },
    find_hospitals: {
      text: "🔍 **Find Hospitals**\n\n**Available Hospitals:**\n🏥 AIIMS New Delhi (Government)\n🏥 PGIMER Chandigarh (Government)\n🏥 Aarogyam Central (Administrative)\n\n**Search by:**\n• Region (Delhi NCR, Punjab)\n• Type (Government, Private)\n• Services (Cardiology, Nephrology)",
      actions: ["🗺️ View Map", "📋 Hospital List"]
    },
    patient_status: {
      text: "📋 **Patient Status Information**\n\n**Real-time Tracking:**\n• RFID attendance monitoring\n• Computer vision detection\n• Vital signs integration\n• Location tracking\n\n**Access Required:** Doctor login needed\n\n**Quick Access:** Use hospital portal",
      actions: ["🏥 Hospital Portal", "📊 Patient Dashboard"]
    },
    emergency: {
      text: "🆘 **Emergency Assistance**\n\n**Critical Organ Allocation:**\n📞 Emergency Hotline: 1800-ORGAN-HELP\n🚨 Priority Queue: Automatic for critical cases\n⏰ Response Time: <15 minutes\n\n**24/7 Support Available**\n\n**For immediate help, contact your hospital coordinator**",
      actions: ["📞 Call Emergency", "🚨 Report Critical Case"]
    },
    support: {
      text: "📞 **Contact Support**\n\n**Technical Support:**\n📧 Email: support@aarogyam.gov.in\n📞 Phone: +91-11-2345-6789\n💬 Live Chat: Available 24/7\n\n**Medical Queries:**\n📧 Email: medical@aarogyam.gov.in\n📞 Helpline: 1800-AAROGYAM\n\n**Response Time:** Within 2 hours",
      actions: ["📧 Send Email", "💬 Live Chat"]
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let responseText = "";
    let actions = [];

    // Check for specific keywords
    if (input.includes('login') || input.includes('hospital') || input.includes('doctor')) {
      const response = botResponses.hospital_login;
      responseText = response.text;
      actions = response.actions;
    } else if (input.includes('transparency') || input.includes('dashboard') || input.includes('admin')) {
      const response = botResponses.transparency;
      responseText = response.text;
      actions = response.actions;
    } else if (input.includes('hospital') || input.includes('find') || input.includes('search')) {
      const response = botResponses.find_hospitals;
      responseText = response.text;
      actions = response.actions;
    } else if (input.includes('patient') || input.includes('status') || input.includes('track')) {
      const response = botResponses.patient_status;
      responseText = response.text;
      actions = response.actions;
    } else if (input.includes('emergency') || input.includes('urgent') || input.includes('critical')) {
      const response = botResponses.emergency;
      responseText = response.text;
      actions = response.actions;
    } else if (input.includes('help') || input.includes('support') || input.includes('contact')) {
      const response = botResponses.support;
      responseText = response.text;
      actions = response.actions;
    } else {
      // Default responses
      const defaultResponses = [
        "I understand you're asking about " + userInput + ". Let me help you with that. Could you be more specific about what you need?",
        "That's an interesting question about " + userInput + ". I can help you with hospital login, transparency data, or patient information. What would you like to know?",
        "I'm here to help with Aarogyam services. You can ask me about hospital access, patient tracking, or system transparency. How can I assist you?"
      ];
      responseText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      actions = ["🏥 Hospital Login", "📊 Transparency", "🔍 Find Hospitals"];
    }

    return {
      id: Date.now(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      actions: actions
    };
  };

  const handleQuickAction = (action) => {
    const response = botResponses[action];
    if (response) {
      const botMessage = {
        id: Date.now(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        actions: response.actions
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleActionClick = (actionText) => {
    if (actionText.includes('Hospital Portal')) {
      window.location.href = '/hospital-portal';
    } else if (actionText.includes('Dashboard') || actionText.includes('Transparency')) {
      window.location.href = '/transparency';
    } else if (actionText.includes('Admin Login')) {
      window.location.href = '/hospital-portal';
      // Auto-fill admin credentials
      setTimeout(() => {
        const event = new CustomEvent('autoFillLogin', { 
          detail: { type: 'admin' } 
        });
        window.dispatchEvent(event);
      }, 1000);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🤖'}
        {!isOpen && <div className="notification-badge">💬</div>}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="bot-avatar">🤖</span>
              <div>
                <h4>Aarogyam AI Assistant</h4>
                <p>Online • Ready to help</p>
              </div>
            </div>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <div className="message-text">
                    {message.text.split('\n').map((line, index) => (
                      <div key={index}>
                        {line.startsWith('**') && line.endsWith('**') ? (
                          <strong>{line.slice(2, -2)}</strong>
                        ) : line.startsWith('•') ? (
                          <div className="bullet-point">{line}</div>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>
                  {message.actions && (
                    <div className="message-actions">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          className="action-btn"
                          onClick={() => handleActionClick(action)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="quick-actions-title">Quick Help:</div>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.action)}
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="message-input"
            />
            <button 
              onClick={handleSendMessage}
              className="send-btn"
              disabled={!inputMessage.trim()}
            >
              🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
