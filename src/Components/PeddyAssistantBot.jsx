import { useState, useRef, useEffect } from "react";
import { FaPaw, FaTimes, FaPaperPlane, FaRobot, FaQuestionCircle } from "react-icons/fa";

const KNOWLEDGE_BASE = [
  {
    triggers: ["adopt", "how to adopt", "adoption process", "apply"],
    response: "🐾 **How to Adopt a Pet on PeddyCare:**\n1. Browse our **Pet Listing** or take the **Smart Matchmaker** quiz.\n2. Click **View Details** on any pet you love.\n3. Click **Adopt Now** to open the adoption modal.\n4. Provide your address and phone number, then submit!\n5. The pet owner/rescuer will review your request in their dashboard and connect with you.",
  },
  {
    triggers: ["donate", "donation", "campaign", "money", "stripe", "refund"],
    response: "💰 **Donation Campaigns:**\n- All donation drives are verified by admins.\n- You can donate securely via **Stripe** with credit/debit card.\n- If a campaign reaches its goal or if you need, donors can request a refund directly from **Dashboard > My Donations**.",
  },
  {
    triggers: ["vaccine", "vaccination", "rabies", "health", "shot"],
    response: "💉 **Vaccination & Health Guidelines:**\n- **Dogs:** Core vaccines include Rabies, DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza).\n- **Cats:** Rabies, FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia).\n- Always check the pet's details page for their current vaccination status and schedule a visit with a licensed vet within 7 days of adoption!",
  },
  {
    triggers: ["food", "diet", "nutrition", "eat", "chocolate"],
    response: "🥗 **Pet Nutrition Essentials:**\n- Always feed age-appropriate pet food (puppy/kitten vs adult formula).\n- ⚠️ **Toxic Foods to Avoid:** Chocolate, onions, garlic, grapes/raisins, avocado, caffeine, and xylitol (artificial sweetener).\n- Always keep fresh, clean water accessible 24/7!",
  },
  {
    triggers: ["home", "prepare", "proofing", "supplies"],
    response: "🏠 **Preparing Your Home for a New Pet:**\n1. **Setup safe zone:** Place a cozy bed, water bowl, and litter box/crate.\n2. **Pet-proof:** Hide electric wires, lock chemical cabinets, and move toxic houseplants out of reach.\n3. **Stock essentials:** Quality food, bowls, collar with ID tag, leash, and chew toys.",
  },
  {
    triggers: ["admin", "dashboard", "add pet"],
    response: "⚙️ **Dashboard & Management:**\n- Log in to access your personal **Dashboard**.\n- You can **Add a Pet** for adoption, create a **Donation Campaign**, track your **Adoption Requests**, and manage your listings with live status updates.",
  },
];

const QUICK_PROMPTS = [
  "🐾 How do I adopt?",
  "💉 Vaccination advice",
  "💰 How donations work?",
  "🥗 Safe pet food tips",
  "🏠 Pet-proofing home",
];

const PeddyAssistantBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello friend! 🐾 I am **PeddyBot**, your AI Pet Care Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message
    const newMessages = [...messages, { sender: "user", text: query, time: userTime }];
    setMessages(newMessages);
    setInput("");

    // Generate response
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let matchedResponse = null;

      for (const item of KNOWLEDGE_BASE) {
        if (item.triggers.some((trigger) => lowerQuery.includes(trigger))) {
          matchedResponse = item.response;
          break;
        }
      }

      if (!matchedResponse) {
        matchedResponse = `Thanks for asking! 😊 For specific inquiries about pet adoption or rescue assistance, you can browse our **Pet Listing**, take our **Matchmaker Quiz**, or contact our care team through the **Contact Us** page.`;
      }

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [...prev, { sender: "bot", text: matchedResponse, time: botTime }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-6 z-40 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-[#FBAE02] to-orange-500 text-black font-extrabold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white"
          aria-label="Open AI Pet Care Assistant"
        >
          <div className="relative">
            <FaPaw className="w-6 h-6 text-orange-950 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="text-sm font-bold tracking-wide hidden sm:inline text-gray-900">
            Ask PeddyBot
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D] text-white p-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FBAE02] flex items-center justify-center text-black font-bold shadow">
                <FaRobot className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  PeddyBot AI
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-[#FBAE02]">PeddyCare AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              aria-label="Close Chat"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-orange-50/70 p-2.5 border-b border-orange-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-semibold bg-white hover:bg-[#FBAE02] text-gray-700 hover:text-black border border-orange-200 px-2.5 py-1 rounded-full whitespace-nowrap transition shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs md:text-sm leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#FBAE02] text-black font-medium rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about pet care..."
              className="flex-1 text-xs md:text-sm bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#FBAE02] focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#FBAE02] hover:bg-orange-500 disabled:opacity-40 text-black hover:text-white p-2.5 rounded-xl transition duration-150 shadow"
              aria-label="Send Message"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PeddyAssistantBot;
