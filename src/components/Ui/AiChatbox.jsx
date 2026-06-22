import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Minimize2, Bot, Sparkles, MessageCircle } from 'lucide-react';

// --------------------------------------------------------------
// Helper: Removes junk characters including replacement chars
// --------------------------------------------------------------
const sanitizeText = (text) => {
  if (!text) return '';
  let clean = String(text);
  
  // 1. Remove the specific Unicode Replacement Character (U+FFFD)
  clean = clean.replace(/\uFFFD/g, '');
  
  // 2. Remove Control Characters (non-printable) except newlines/tabs
  clean = clean.replace(/[\x00-\x09\x0b-\x0c\x0e-\x1f\x7f-\x9f]/g, '');
  
  // 3. Remove Zero-Width Spaces (often cause invisible issues)
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  return clean;
};

// --------------------------------------------------------------
// Lead capture conversation flow
// --------------------------------------------------------------
const QUESTIONS = [

  {
    id: 'orderType',
    text: "🏢 Are you ordering as an individual or for a business?",
    type: 'choice',
    options: ['Individual', 'Business']
  },
  {
    id: 'productType',
    text: "📦 What type of products/supplies are you looking for?",
    type: 'choice',
    options: ['Guest Amenities', 'Eco-Friendly Sustainable Bags', 'Cleaning Supplies']
  },
  {
    id: 'frequency',
    text: "🔄 Is this a one-time order or a recurring supply?",
    type: 'choice',
    options: ['One-time order', 'Recurring supply']
  },
 
  {
    id: 'mobile',
    text: "📱 What is your mobile number?",
    type: 'tel',
    validate: (val) => /^[0-9+\-\s()]{7,20}$/.test(val)
  },
  {
    id: 'isOsse',
    text: "🏨 Is this for a new hotel/restaurant opening (OS&E project)?",
    type: 'choice',
    options: ['Yes', 'No']
  }
];

// Target phone number to receive lead details (UAE)
const TARGET_PHONE = '+971527087748]';

// Helper: Generate clean WhatsApp message (Double sanitized)
const generateWhatsAppMessage = (answers) => {
  const labels = {
    serviceCategory: 'Service category',
    orderType: 'Order type',
    productType: 'Product type',
    frequency: 'Frequency',
    mobile: 'Mobile number',
    isOsse: 'OS&E project'
  };

  let message = 'New lead from Quote Assistant\n\n';
  for (const [key, label] of Object.entries(labels)) {
    if (answers[key]) {
      // Sanitize the label AND the value
      const cleanLabel = sanitizeText(label);
      const cleanValue = sanitizeText(answers[key]);
      message += `${cleanLabel}: ${cleanValue}\n`;
    }
  }
  message += '\n Please contact this lead. Thank you!';
  
  // Final global strip to be absolutely sure
  message = sanitizeText(message);
  
  return encodeURIComponent(message);
};

// Helper: Open WhatsApp
const openWhatsAppWithLead = (answers) => {
  const encodedMessage = generateWhatsAppMessage(answers);
  const phoneNumber = TARGET_PHONE.replace('+', '');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

const sendLeadToPhoneNumber = async (answers) => {
  console.log('Sending lead to', TARGET_PHONE, answers);
  return Promise.resolve();
};

const submitLead = async (answers) => {
  await sendLeadToPhoneNumber(answers);
};

// --------------------------------------------------------------
// UI Components
// --------------------------------------------------------------
const MessageBubble = ({ message, isUser, isQuestion }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-sm' 
          : isQuestion
            ? 'bg-amber-50 border-l-4 border-amber-400 text-slate-700 rounded-bl-sm'   
            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
      }`}>
        {!isUser && (
          <div className="flex items-center gap-1 mb-1">
            <Sparkles size={12} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">AI Assistant</span>
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
      <div className="flex space-x-1 items-center">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

// --------------------------------------------------------------
// Main AIChatBox Component
// --------------------------------------------------------------
const AIChatBox = ({ products = [], categoriesList = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hi! I'll help you get a quote. Let's start with a few details.", isUser: false, isQuestion: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentQuestion = !isComplete && conversationStep < QUESTIONS.length ? QUESTIONS[conversationStep] : null;
  const isChoiceQuestion = currentQuestion && currentQuestion.type === 'choice';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    if (isComplete) return;

    // Sanitize user input immediately
    const sanitizedText = sanitizeText(text.trim());
    if (!sanitizedText) return;

    const userMsg = { id: Date.now(), text: sanitizedText, isUser: true, isQuestion: false };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const currentQ = QUESTIONS[conversationStep];
    let isValid = true;
    if (currentQ.validate) {
      isValid = currentQ.validate(sanitizedText);
    } else if (currentQ.type === 'choice') {
      isValid = currentQ.options.some(opt => opt.toLowerCase() === sanitizedText.toLowerCase());
    }
    if (!isValid) {
      setTimeout(() => {
        const errorMsg = { id: Date.now() + 1, text: `❌ Invalid input. ${currentQ.text}`, isUser: false, isQuestion: false };
        setMessages(prev => [...prev, errorMsg]);
        setIsTyping(false);
      }, 500);
      return;
    }

    const newAnswers = { ...answers, [currentQ.id]: sanitizedText };
    setAnswers(newAnswers);

    const nextStep = conversationStep + 1;
    setConversationStep(nextStep);

    if (nextStep < QUESTIONS.length) {
      const nextQ = QUESTIONS[nextStep];
      setTimeout(() => {
        const botMsg = { id: Date.now() + 1, text: nextQ.text, isUser: false, isQuestion: true };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 600);
    } else {
      setIsComplete(true);
      setTimeout(async () => {
        const thankMsg = {
          id: Date.now() + 1,
          // Removed the specific sentence regarding contact details
          text: "✅ Thank you! Please click the button below to send your details via WhatsApp.",
          isUser: false,
          isQuestion: false
        };
        setMessages(prev => [...prev, thankMsg]);
        setIsTyping(false);
        await submitLead(newAnswers);
      }, 600);
    }
  }, [conversationStep, answers, isComplete]);

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 1 && conversationStep === 0 && !isComplete) {
      setTimeout(() => {
        const firstQuestion = QUESTIONS[0].text;
        setMessages(prev => [...prev, { id: Date.now(), text: firstQuestion, isUser: false, isQuestion: true }]);
      }, 500);
    }
  }, [isOpen, isMinimized, messages.length, conversationStep, isComplete]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isChoiceQuestion) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleOptionClick = (option) => {
    if (isChoiceQuestion && !isTyping) {
      sendMessage(option);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Closed state (floating button)
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-18 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 group"
        aria-label="Open Quote Assistant"
      >
        <Bot className="w-6 h-6 group-hover:scale-105 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-white rounded-full shadow-lg border border-slate-200 pr-3 pl-4 py-2 cursor-pointer hover:shadow-xl transition-all" onClick={toggleChat}>
        <Sparkles size={18} className="text-amber-500" />
        <span className="text-sm font-medium text-slate-700">Quote Assistant</span>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <button
          onClick={(e) => { e.stopPropagation(); closeChat(); }}
          className="ml-2 p-1 hover:bg-slate-100 rounded-full"
        >
          <X size={16} className="text-slate-500" />
        </button>
      </div>
    );
  }

  // Full open chat window
  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1 rounded-full">
            <Sparkles size={16} className="text-amber-300" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Quote Assistant</h3>
            <p className="text-[11px] text-blue-200">We’ll contact you</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <Minimize2 size={16} />
          </button>
          <button onClick={closeChat} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg.text} 
            isUser={msg.isUser} 
            isQuestion={msg.isQuestion}
          />
        ))}
        {isTyping && <TypingIndicator />}
        
        {/* WhatsApp button - shown only when conversation is complete */}
        {isComplete && !isTyping && (
          <div className="flex justify-center my-3">
            <button
              onClick={() => openWhatsAppWithLead(answers)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-2.5 text-sm flex items-center gap-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <MessageCircle size={18} />
              Send details via WhatsApp
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Options panel for choice questions */}
      {isChoiceQuestion && !isComplete && !isTyping && (
        <div className="border-t border-slate-200 p-3 bg-white">
          <div className="flex flex-wrap gap-2 justify-center">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-full text-sm font-medium transition-colors border border-slate-200 shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area - hidden for choice questions to enforce button selection */}
      {!isChoiceQuestion && (
        <div className="border-t border-slate-200 p-3 bg-white">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                rows={1}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none text-sm"
              />
            </div>
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-2">
            We’ll never share your info • <button className="text-blue-500" onClick={() => window.location.reload()}>Restart</button>
          </div>
        </div>
      )}
      
      {/* Show restart link even when input is hidden */}
      {isChoiceQuestion && !isComplete && (
        <div className="border-t border-slate-200 p-2 bg-white text-center">
          <div className="text-[10px] text-slate-400">
            <button className="text-blue-500" onClick={() => window.location.reload()}>Restart conversation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBox;