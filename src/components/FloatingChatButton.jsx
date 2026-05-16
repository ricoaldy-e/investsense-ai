import { BotMessageSquare } from 'lucide-react';

const FloatingChatButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 bg-transparent border border-accent/40 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-bg-dark transition-all duration-300 z-50"
      aria-label="Open Chatbot"
    >
      <BotMessageSquare className="w-5 h-5" />
      {/* Notification Dot */}
      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full"></span>
    </button>
  );
};

export default FloatingChatButton;
