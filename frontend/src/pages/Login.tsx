import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>ENTRAR</h2>
          <p style={{ fontSize: '12px', marginBottom: '16px' }}>ENTRE COM SEU EMAIL E SENHA PARA CONTINUAR</p>

          <input type="email" placeholder="E-MAIL" style={inputStyle} disabled />
          <input type="password" placeholder="SENHA" style={inputStyle} disabled />

          <button style={submitButtonStyle} disabled>ENTRAR</button>

          <div style={{ margin: '16px 0', height: '1px', backgroundColor: '#eee' }} />

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

          <p style={{ fontSize: '12px', marginTop: '16px' }}>
            <a href="#" style={{ color: 'gray', textDecoration: 'underline' }}>ESQUECEU SUA SENHA?</a>
          </p>
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
          <button style={submitButtonStyle}>
            CADASTRE-SE EM NOSSA LOJA
          </button>
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
