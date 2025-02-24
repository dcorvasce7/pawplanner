import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';
import { format } from 'date-fns'; // Importa la funzione format

function CalendarioAppuntamenti() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);  // Per tenere traccia dell'evento selezionato
  const [isModalOpen, setIsModalOpen] = useState(false);  // Stato per aprire/chiudere il modal

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/getEvents');
        setEvents(response.data); 
      } catch (error) {
        console.error('Errore nel recupero eventi: ', error);
      }
    };

    fetchEvents();
  }, []);

  // Gestore del click sugli eventi
  const handleEventClick = (info) => {
    // Imposta l'evento selezionato
    setSelectedEvent(info.event);
    setIsModalOpen(true);  // Apre il modal
  };

  // Funzione per chiudere il modal
  const closeModal = () => {
    setIsModalOpen(false);
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
          <p><strong>Descrizione:</strong> {selectedEvent ? selectedEvent.extendedProps.description : ''}</p>
          <p><strong>Data Inizio:</strong> {selectedEvent ? format(new Date(selectedEvent.start), 'dd/MM/yyyy HH:mm') : ''}</p>
          <p><strong>Data Fine:</strong> {selectedEvent ? format(new Date(selectedEvent.end), 'dd/MM/yyyy HH:mm') : ''}</p>
        </div>
        <div className="modal-footer">
          <button onClick={closeModal}>Chiudi</button>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarioAppuntamenti;