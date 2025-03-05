import db from '../../../lib/db';

export default function handler(req, res) {
  const { id_veterinario } = req.query;

  if (req.method === 'GET') {
    db.query(
      'SELECT * FROM orario WHERE ID_Veterinario = ? ORDER BY Giorno, Orario_Inizio',
      [id_veterinario],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(rows);
      }
    ); 
  } else if (req.method === 'POST') {
    const { orario_inizio, orario_fine, giorno, id_veterinario} = req.body;

    // Controllo preventivo per evitare orari duplicati per lo stesso giorno
    //da capire cosa fa
    db.query(
      'SELECT * FROM orario WHERE Giorno = ? AND ID_Veterinario = ? AND (Orario_Inizio < ? AND Orario_Fine > ?)',
      [giorno, id_veterinario, orario_fine, orario_inizio],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (rows.length > 0) {
          // Se esiste già un orario, non procediamo con l'inserimento
          return res.status(400).json({ message: 'Esiste già un orario per questo giorno.' });
        }

        // Se non esiste un conflitto, procedi con l'inserimento
        db.query(
          'INSERT INTO orario (Orario_Inizio, Orario_Fine, ID_Veterinario, Giorno) VALUES (?, ?, ?, ?)',
          [orario_inizio, orario_fine, id_veterinario, giorno],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ id: result.insertId, message: 'Orario aggiunto con successo' });
          }
        );
      }
    );
  } else if (req.method === 'DELETE') {
    const { id_orario } = req.body;
    db.query(
      'DELETE FROM orario WHERE ID_Orario = ?',
      [id_orario],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: 'Orario eliminato con successo' });
      }
    );
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
