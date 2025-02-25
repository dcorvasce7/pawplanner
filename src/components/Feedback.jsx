import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Feedback({ role }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [testo, setTesto] = useState('');
  const [valutazione, setValutazione] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
    fetchFeedbacks();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('/api/session');
      setUserId(response.data.user.id);
    } catch (error) {
      console.error('Errore nel recupero dell\'ID utente:', error);
    }
  };

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
    try {
      await axios.post('/api/feedback', { testo, valutazione });
      setTesto('');
      setValutazione(1);
      fetchFeedbacks(); // Aggiorna i feedback dopo la creazione
    } catch (error) {
      console.error('Errore nella creazione del feedback:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/feedback?id=${id}`);
      console.log('Response data:', response.data); // Log della risposta dell'API
      console.log('User ID:', userId); // Log dell'ID utente corrente
      if (response.data.userId === userId) {
        fetchFeedbacks(); // Aggiorna i feedback dopo la cancellazione
      } else {
        console.error('Non autorizzato a eliminare questo feedback');
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione del feedback:', error);
    }
  };

  if (loading) {
    return <div className='loading'>Caricamento...</div>;
  }

  return (
    <div className='feedback-content'>
      <div className="header">
        <h2>Feedback e Recensioni</h2>
      </div>
      {role === 'utente' && (
        <div className='form-group'>
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
          <button onClick={handleCreate} disabled={!testo.trim()}>Crea</button>
        </div>
      )}
      <ul className="feedback-list">
        {feedbacks.map((feedback) => {
          const dataOra = new Date(feedback.data);
          const dataFormattata = isNaN(dataOra) ? 'Data non valida' : format(dataOra, 'dd/MM/yyyy HH:mm');
          return (
            <li key={feedback.ID_Feedback} className='feedback-item'>
              <p className='user'><strong>{feedback.Nome} {feedback.Cognome}</strong></p>
              <p className='descripion'>Testo: {feedback.Testo}</p>
              <p className='valutation'>Valutazione: {feedback.Valutazione}</p>
              <p className='date'>Data: {dataFormattata}</p>
              {role === 'utente' && feedback.ID_Utente === userId && (
                <div className="button-group">
                  <button onClick={() => handleDelete(feedback.ID_Feedback)}>Cancella</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Feedback;