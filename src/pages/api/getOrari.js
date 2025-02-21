// src/pages/api/getOrari.js
import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const query = `
      SELECT 
        ID_Orario,
        Orario_Inizio,
        Orario_Fine,
        Stato,
        ID_Veterinario,
        Giorno
      FROM Orario
      ORDER BY FIELD(Giorno, 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'), Orario_Inizio
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Errore nel recupero degli orari:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      }
      return res.status(200).json(results);
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}
