import { FaWhatsapp } from 'react-icons/fa';
import { RiChatSmile3Fill } from 'react-icons/ri';

interface FloatingIconsProps {
  toggleChat: () => void;
}

export default function FloatingIcons({ toggleChat }: FloatingIconsProps) {
  return (
    <>
      <button onClick={toggleChat} className="fixed bottom-6 right-6 bg-black rounded-full p-4 shadow-lg">
        <RiChatSmile3Fill size={24} className="text-white" />
      </button>

      <a
        href="https://api.whatsapp.com/send?l=pt&phone=5511945128297&text=Poderia%20me%20ajudar?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 rounded-full p-4 shadow-lg"
      >
        <FaWhatsapp size={24} className="text-white" />
      </a>
    </>
  );
}
