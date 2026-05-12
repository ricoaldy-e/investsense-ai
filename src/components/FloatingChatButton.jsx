import { BotMessageSquare } from 'lucide-react';

const FloatingChatButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-brand-blue rounded-lg flex items-center justify-center text-white shadow-lg hover:bg-cyan-700 transition-colors z-50 border border-brand-blue/50"
      aria-label="Open Chatbot"
    >
      <BotMessageSquare className="w-6 h-6" />
      {/* Notification Dot */}
      <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-brand-blue rounded-full"></span>
    </button>
  );
};

export default FloatingChatButton;
