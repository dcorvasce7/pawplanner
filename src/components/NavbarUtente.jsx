import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

function NavbarUtente() {
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/logout');
      router.push('/LoginUtente');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <input type="checkbox" id="sidebar-active" />
      <label htmlFor="sidebar-active" className="open-sidebar-button">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M120-240v-66.67h720V-240H120Zm0-206.67v-66.66h720v66.66H120Zm0-206.66V-720h720v66.67H120Z"/></svg>
      </label>

      <label id="overlay" htmlFor="sidebar-active"></label>
      <div className="link-container">
        <label htmlFor="sidebar-active" className="close-sidebar-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/></svg>
        </label>
        <Link href="/DashboardUtente">Dashboard</Link>
        <Link href="/FeedbackRecensioniUtente">Feedback e Recensioni</Link>
        <Link className="profile" href="/ProfiloUtente">Il mio Profilo</Link>
        <a href="/" onClick={handleLogout}>Esci</a>
      </div>
    </nav>
  );
}

export default NavbarUtente;