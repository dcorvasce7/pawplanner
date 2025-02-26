import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { it } from 'date-fns/locale';

function CalendarioOrari() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);  // Per tenere traccia dell'evento selezionato
  const [isModalOpen, setIsModalOpen] = useState(false);  // Stato per aprire/chiudere il modal
  const [description, setDescription] = useState(''); // Stato per la descrizione
  const [userId, setUserId] = useState(null); // Stato per l'ID dell'utente

  // Definisci localStartDate e localEndDate nel contesto del modal
  const timeZone = 'Europe/Rome';
  const localStartDate = selectedEvent ? toZonedTime(new Date(selectedEvent.start), 'Europe/Rome') : null;
  const localEndDate = selectedEvent ? toZonedTime(new Date(selectedEvent.end), 'Europe/Rome') : null;

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchEvents();
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('/api/session');
      setUserId(response.data.user.id);
    } catch (error) {
      console.error('Errore nel recupero dell\'ID utente:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/getEventsUtente', {
        params: { selectedDate: format(new Date(), 'yyyy-MM-dd') }
      });
      setEvents(response.data); 
    } catch (error) {
      console.error('Errore nel recupero eventi: ', error);
    }
  };

  // Gestore del click sugli eventi
  const handleEventClick = (info) => {
    // Impedisce l'apertura del modal per gli appuntamenti già prenotati
    if (info.event.title === 'Occupato') {
      return;
    }

    // Imposta l'evento selezionato
    setSelectedEvent(info.event);
    setIsModalOpen(true);  // Apre il modal
  };

  // Funzione per chiudere il modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAppointment = {
      ID_Orario: selectedEvent.id,
      Descrizione: description,
      ID_Utente: userId, // Utilizza l'ID dell'utente corrente
      ID_Veterinario: 25, // Sostituisci con l'ID del veterinario corrente
      data: format(localStartDate, 'yyyy-MM-dd HH:mm:ss', { timeZone }), // Converti la data nel formato corretto
      Motivo: 'Visita'
    };

    try {
      await axios.post('/api/createAppointment', newAppointment);
      setIsModalOpen(false);
      setDescription('');
      // Ricarica gli eventi dopo la creazione dell'appuntamento
      fetchEvents();
    } catch (error) {
      console.error('Errore nella creazione dell\'appuntamento:', error);
    }
  };

  return (
    <div className="calendario-appuntamenti">
      <h2>Calendario Appuntamenti</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}  // Aggiungi il gestore del click sugli eventi
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        height="70vh"
        contentHeight="auto"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // Formato 24 ore
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // Formato 24 ore
        }}
        eventContent={(eventInfo) => (
          <div className={eventInfo.event.title === 'Occupato' ? 'event-occupied' : 'event-available'}>
            <b>{eventInfo.timeText}</b>
          </div>
        )}
      />

      {/* Modal per visualizzare i dettagli dell'evento */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Dettaglio Evento"
        className="custom-modal" // Aggiungi una classe CSS personalizzata
        overlayClassName="custom-overlay" // Aggiungi una classe CSS per l'overlay
      >
        <div className="modal-header">
          <h2>{selectedEvent ? selectedEvent.title : 'Evento'}</h2>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Descrizione:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <p><strong>Data Inizio:</strong> {localStartDate ? format(localStartDate, 'dd MMMM yyyy HH:mm', { locale: it }) : ''}</p>
              <p><strong>Data Fine:</strong> {localEndDate ? format(localEndDate, 'dd MMMM yyyy HH:mm', { locale: it }) : ''}</p>
            </div>
            <div className="modal-footer">
              <button type="submit">Prenota</button>
              <button type="button" onClick={closeModal}>Chiudi</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarioOrari;