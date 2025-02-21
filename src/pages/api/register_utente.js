import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      nome, 
      cognome, 
      email, 
      telefono,
      password, 
      confirmpassword 
    } = req.body;

    // Esegui una validazione sulle password (come per la password che deve corrispondere)
    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Le password non corrispondono" });
    }

    try {
      // Cifrare la password prima di inserirla nel database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserimento nel database con la password cifrata
      const query = `
      INSERT INTO utente (Nome, Cognome, Email, Numero_di_telefono, password)
      VALUES (?, ?, ?, ?, ?)
    `;    

    const values = [
        nome,
        cognome,
        email,
        telefono,
        hashedPassword, // La password cifrata
      ];
      
      db.query(query, values, (err) => {
        if (err) {
          console.error('Errore nell\'inserimento dei dati: ', err);
          return res.status(500).json({ error: "Errore interno del server" });
        }
        return res.status(201).json({ message: "Registrazione avvenuta con successo!" });
      });
    } catch (error) {
      console.error('Errore nel salvataggio dei dati: ', error);
      return res.status(500).json({ error: "Errore nel salvataggio dei dati" });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}