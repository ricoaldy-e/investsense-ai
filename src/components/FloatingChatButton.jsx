import { BotMessageSquare } from 'lucide-react';

const FloatingChatButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 z-50"
      aria-label="Open Chatbot"
    >
      <BotMessageSquare className="w-6 h-6" />
      {/* Notification Dot */}
      <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-brand-blue rounded-full"></span>
    </button>
  );
};

export default FloatingChatButton;
