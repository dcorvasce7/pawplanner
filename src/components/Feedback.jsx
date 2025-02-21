import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Feedback({ role }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [testo, setTesto] = useState('');
  const [valutazione, setValutazione] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/feedback', { params: { role } });
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Errore nel recupero dei feedback:', error);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!testo.trim()) {
      setError('Il testo del feedback è obbligatorio.');
      return;
    }
    setError('');
    try {
      const response = await axios.post('/api/feedback', { testo, valutazione });
      setTesto('');
      setValutazione(1);
      fetchFeedbacks(); // Aggiorna i feedback dopo la creazione
    } catch (error) {
      console.error('Errore nella creazione del feedback:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feedback?id=${id}`);
      fetchFeedbacks(); // Aggiorna i feedback dopo la cancellazione
    } catch (error) {
      console.error('Errore nell\'eliminazione del feedback:', error);
    }
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div>
      <h2>Gestione Feedback</h2>
      {role === 'utente' && (
        <div>
          <input
            type="text"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="Testo"
          />
          <select value={valutazione} onChange={(e) => setValutazione(e.target.value)}>
            {[1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          <button onClick={handleCreate}>Crea Feedback</button>
        </div>
      )}
      <ul>
        {feedbacks.map((feedback) => {
          const dataOra = new Date(feedback.data);
          const dataFormattata = isNaN(dataOra) ? 'Data non valida' : format(dataOra, 'dd/MM/yyyy HH:mm');
          return (
            <li key={feedback.ID_Feedback}>
              <p>ID Utente: {feedback.ID_Utente}</p>
              <p>Testo: {feedback.Testo}</p>
              <p>Valutazione: {feedback.Valutazione}</p>
              <p>Data: {dataFormattata}</p>
              {role === 'utente' && (
                <button onClick={() => handleDelete(feedback.ID_Feedback)}>Cancella</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Feedback;