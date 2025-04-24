import './App.css'
import ChatWidget from './ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-white text-black relative">
      <div className="flex justify-center items-center pt-20">
        <h1 className="text-3xl font-bold">🔥 FURIA Fan Chat 🔥</h1>
      </div>
      <ChatWidget /> {/* 👈 Now it’s sitting pretty on the corner */}
    </div>
  );
}

export default App;


