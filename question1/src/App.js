import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBars, FaTimes, FaLink, FaTrash } from 'react-icons/fa';

export default function App() {
  const [urls, setUrls] = useState([{ longUrl: '', validity: 30, shortcode: '' }]);
  const [shortLinks, setShortLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const generateShortcode = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  };

  const validateUrl = (url) => {
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
      return parsedUrl.hostname.includes('.') || parsedUrl.protocol.startsWith('http');
    } catch {
      return false;
    }
  };

  const handleShorten = () => {
    const newLinks = [];
    const existingShortcodes = new Set(shortLinks.map(link => link.shortcode));

    for (let item of urls) {
      if (!validateUrl(item.longUrl)) {
        alert(`Invalid URL provided: ${item.longUrl}`);
        return;
      }

      let code = item.shortcode.trim() || generateShortcode();
      while (existingShortcodes.has(code)) {
        code = generateShortcode();
      }

      existingShortcodes.add(code);

      newLinks.push({
        longUrl: item.longUrl,
        shortcode: code,
        validity: parseInt(item.validity) || 30,
        createdAt: new Date().toLocaleString(),
        shortUrl: `http://localhost:3000/${code}`
      });
    }

    setShortLinks(prev => [...prev, ...newLinks]);
    setUrls([{ longUrl: '', validity: 30, shortcode: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    setUrls(prevUrls => {
      const updated = [...prevUrls];
      updated[index][field] = value;
      return updated;
    });
  };

  const addUrlField = () => {
    setUrls(prevUrls => {
      if (prevUrls.length < 5) {
        return [...prevUrls, { longUrl: '', validity: 30, shortcode: '' }];
      } else {
        alert('Maximum 5 URLs allowed.');
        return prevUrls;
      }
    });
  };

  const removeShortLink = (index) => {
    setShortLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
  };

  const renderHome = () => (
    <div className="container" data-aos="fade-up">
      <h2>URL Shortener</h2>

      {urls.map((item, idx) => (
        <div className="url-input" key={idx}>
          <input type="text" placeholder="Enter Long URL" value={item.longUrl} onChange={(e) => handleInputChange(idx, 'longUrl', e.target.value)} />
          <input type="number" placeholder="Validity (minutes)" value={item.validity} onChange={(e) => handleInputChange(idx, 'validity', e.target.value)} />
          <input type="text" placeholder="Custom Shortcode (optional)" value={item.shortcode} onChange={(e) => handleInputChange(idx, 'shortcode', e.target.value)} />
        </div>
      ))}

      <button className="btn" onClick={handleShorten}>Shorten URLs</button>
      <button className="btn add-btn" onClick={addUrlField}>Add Another URL</button>

      <div className="result" data-aos="zoom-in">
        {shortLinks.map((link, idx) => (
          <div className="short-link" key={idx}>
            <FaLink className="icon" />
            <a href={link.longUrl} target="_blank" rel="noopener noreferrer">{link.shortUrl}</a>
            <span> (Valid for: {link.validity} mins)</span>
            <em style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#bbb' }}>Created: {link.createdAt}</em>
            <FaTrash className="delete-icon" onClick={() => removeShortLink(idx)} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="container" data-aos="fade-up">
      <h2>Analytics</h2>
      <p>Total URLs shortened: <strong>{shortLinks.length}</strong></p>
      <ul style={{ textAlign: 'left', padding: '0 20px' }}>
        {shortLinks.map((link, idx) => (
          <li key={idx}>
            <strong>{link.shortUrl}</strong> → {link.longUrl} (Created: {link.createdAt})
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAbout = () => (
    <div className="container" data-aos="fade-up">
      <h2>About Shortly</h2>
      <p>Shortly is a simple, elegant, and responsive URL shortener built with React. You can create short links with optional custom shortcodes, track their validity, and manage them easily.</p>
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">Shortly</h1>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li onClick={() => setActivePage('home')}>Home</li>
          <li onClick={() => setActivePage('analytics')}>Analytics</li>
          <li onClick={() => setActivePage('about')}>About</li>
        </ul>
      </nav>

      {activePage === 'home' && renderHome()}
      {activePage === 'analytics' && renderAnalytics()}
      {activePage === 'about' && renderAbout()}

      <style jsx>{`
        body {
          margin: 0;
          background-color: #121212;
          color: #fff;
          font-family: 'Poppins', sans-serif;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background-color: #1f1f1f;
          box-shadow: 0 4px 10px rgba(0,0,0,0.6);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: #00bcd4;
        }

        .menu-icon {
          cursor: pointer;
          font-size: 2rem;
          color: #fff;
        }

        .nav-links {
          list-style: none;
          display: flex;
          gap: 20px;
        }

        .nav-links li {
          cursor: pointer;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .nav-links li:hover {
          color: #00bcd4;
          transform: scale(1.1);
        }

        .nav-links.active {
          display: block;
        }

        .container {
          padding: 30px 20px;
          max-width: 900px;
          margin: auto;
          text-align: center;
        }

        .url-input {
          display: grid;
          grid-template-columns: 1fr 120px 180px;
          gap: 12px;
          margin-bottom: 15px;
        }

        input {
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background-color: #2c2c2c;
          color: #fff;
        }

        .btn {
          padding: 12px 25px;
          margin-top: 15px;
          border: none;
          background-color: #00bcd4;
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn:hover {
          background-color: #0097a7;
        }

        .add-btn {
          margin-left: 10px;
          background-color: #4caf50;
        }

        .add-btn:hover {
          background-color: #388e3c;
        }

        .result {
          margin-top: 25px;
        }

        .short-link {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1e1e1e;
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .short-link a {
          color: #00bcd4;
          text-decoration: none;
        }

        .short-link a:hover {
          text-decoration: underline;
          color: #1de9b6;
        }

        .icon, .delete-icon {
          cursor: pointer;
        }

        .delete-icon:hover {
          color: #f44336;
        }

        @media (max-width: 600px) {
          .url-input {
            grid-template-columns: 1fr;
          }

          .btn, .add-btn {
            width: 100%;
            margin-top: 10px;
          }

          .short-link {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
