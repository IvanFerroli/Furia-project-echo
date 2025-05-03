import { useEffect } from 'react';

declare global {
  interface Window {
    botpress?: {
      init: (config: any) => void;
      toggle: () => void;
    };
  }
}

export default function FuriaFanWebchat() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #webchat .bpFab {
        display: none !important;
      }

      #custom-panther-btn-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 64px;
        height: 64px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        z-index: 2147483647;
        cursor: pointer;
      }

      #custom-panther-btn {
        width: 50px;
        height: 50px;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.4/inject.js';
    script.async = true;
    script.onload = () => {
      window.botpress?.init({
        botId: '527114d1-97fe-4cb9-a05b-268dd4923ebc',
        clientId: '1abede0b-1946-4626-a7cb-6ebdf42c7e84',
        selector: '#webchat',
        configuration: {
          composerPlaceholder: 'Fala FURIOSO!',
          botName: 'Black Pantha',
          botAvatar: 'https://files.bpcontent.cloud/2025/04/28/19/20250428195344-NR2WMF5N.svg',
          themeMode: 'dark',
          color: '#ffffff',
          variant: 'solid',
          radius: 4,
          fontFamily: 'inter',
          additionalStylesheetUrl:
            'https://files.bpcontent.cloud/2025/04/28/19/20250428194638-J9C6F3JX.css',
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
      style.remove();
    };
  }, []);

  const toggleBot = () => {
    window.botpress?.toggle();
  };

  return (
    <>
      <div id="webchat" />
      <div id="custom-panther-btn-container" onClick={toggleBot}>
        <img
          id="custom-panther-btn"
          src="/furia-logos.png"
          alt="Panther Toggle"
        />
      </div>
    </>
  );
}

export { }
