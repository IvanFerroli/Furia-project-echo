import { useState } from 'react';
import Header from './Header';
import WelcomeSection from './WelcomeSection';
import FloatingIcons from './FloatingIcons';
import NewsCarousel from './NewsCarousel';


export default function LandingPage() {
  const [chatVisible, setChatVisible] = useState(false);

  const toggleChat = () => setChatVisible(prev => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <NewsCarousel />

      <WelcomeSection toggleChat={toggleChat} chatVisible={chatVisible} />

      {/* Chat Widget Placeholder */}
      {chatVisible && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Chatbot Loaded Here
          </div>
        </div>
      )}

      <FloatingIcons toggleChat={toggleChat} />
    </div>
  );
}
