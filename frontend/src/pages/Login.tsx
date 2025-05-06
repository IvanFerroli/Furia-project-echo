import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../config';


export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      navigate('/perfil'); // redirect after login
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff',
      padding: '0 16px',
      fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
    }}>
      <div style={{
        display: 'flex',
        maxWidth: '800px',
        width: '100%',
        gap: '24px',
      }}>
        {/* Left - Login */}
        <div style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center', // 👈 adiciona aqui
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>BEM-VINDO AO</h2>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '1px' }}>
            FURIA PROJECT ECHO
          </h1>
          <p style={{ fontSize: '13px', marginBottom: '32px', color: '#444' }}>
            Faça login com sua conta Google para acessar o chat e a área de fãs.
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              ...providerButtonStyle,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
            Continuar com o Google
          </button>
        </div>



        {/* Right - Register */}
        <div style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>QUERO ME CADASTRAR</h2>
          <p style={{ fontSize: '12px', marginBottom: '16px' }}>
            EM APENAS UM PASSO, CRIE UMA CONTA E FINALIZE SUA COMPRA<br />
            AINDA NÃO TEM CONTA?
          </p>
          <a
            href="https://checkout.furia.gg/login/cadastro?returnUrl="
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...submitButtonStyle,
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            CADASTRE-SE EM NOSSA LOJA
          </a>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'black',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const providerButtonStyle = {
  width: '100%',
  padding: '12px',
  fontWeight: 'bold',
  borderRadius: '4px',
  cursor: 'pointer',
};
