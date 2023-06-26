import './Navbar.scss';
import React from 'react';
import { Sun, Moon, Google } from '../assets/appIcons.tsx';
import logoIcon from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDarkMode from '../hooks/useDarkMode';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();

  const handleAuthentication = () => {
    console.log('');
  };
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} theme={'dark'} transition={Zoom} />

      <nav className="main-navbar">
        <div className="app-logo" onClick={() => navigate('/')}>
          <img src={logoIcon} alt="app logo" />
        </div>
        <div className="actions">
          <button
            className="action theme-switcher"
            onClick={() => setDarkMode((prvState) => !prvState)}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button onClick={handleAuthentication} className="action user-profile">
            <Google />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
