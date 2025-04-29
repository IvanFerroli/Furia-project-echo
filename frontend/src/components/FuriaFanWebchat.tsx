import { useEffect } from 'react';

export default function FuriaFanWebchat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js";
    script.async = true;
    script.onload = () => {
      window.botpress?.init({
        botId: "527114d1-97fe-4cb9-a05b-268dd4923ebc",
        clientId: "1abede0b-1946-4626-a7cb-6ebdf42c7e84",
        selector: "#webchat",
        configuration: {
          themeMode: "light",
          botName: "FURIA Fan Chat 🐆🔥",
          stylesheet: "https://cdn.botpress.cloud/webchat/v2.4/assets/modules/channel-web/default.css",
        }
      });
    };
    
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div id="webchat" style={{ width: '400px', height: '600px' }}></div>
    </div>
  );
}
