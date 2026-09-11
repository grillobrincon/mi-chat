import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Tu nueva URL pública de internet
const URL_BACKEND = "https://chat-be-3zb6.onrender.com"; 
const socket = io(URL_BACKEND);

function App() {
  const [mensaje, setMensaje] = useState("");
  const [listaMensajes, setListaMensajes] = useState([]);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setConectado(true);
    });

    socket.on('recibir_mensaje', (data) => {
      setListaMensajes((prev) => [...prev, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('recibir_mensaje');
    };
  }, []);

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (mensaje.trim() !== "") {
      socket.emit('enviar_mensaje', { texto: mensaje, id: socket.id });
      setMensaje("");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>🎮 Mi Primer Chat Multiplayer</h2>
      
      <p style={{ color: conectado ? 'green' : 'orange' }}>
        {conectado ? "🟢 Servidor Conectado" : "⏳ Conectando al servidor... (Espera un minuto si Render estaba dormido)"}
      </p>

      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto', padding: '10px', marginBottom: '10px', borderRadius: '5px', background: '#f9f9f9' }}>
        {listaMensajes.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.id === socket.id ? 'right' : 'left', margin: '5px 0' }}>
            <span style={{ 
              background: msg.id === socket.id ? '#daf7a6' : '#e2e2e2', 
              padding: '6px 12px', 
              borderRadius: '15px',
              display: 'inline-block'
            }}>
              {msg.texto}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={enviarMensaje} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={mensaje} 
          onChange={(e) => setMensaje(e.target.value)} 
          placeholder="Escribe un mensaje aquí..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;