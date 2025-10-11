import React, { useState } from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modal: {
    backgroundColor: '#272727', 
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '56rem', 
    display: 'flex',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '33.333333%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    width: '66.666667%',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
  },
  buttonBase: {
    fontWeight: 'bold',
    padding: '12px 32px',
    borderRadius: '9999px',
    width: '100%',
    maxWidth: '280px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s, border-color 0.2s',
  },
  signUpButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    marginBottom: '16px',
  },
  downloadButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid #737373',
    marginBottom: '24px',
  },
  loginText: {
    color: '#a3a3a3',
  },
  loginLink: {
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
  }
};


// THÊM 'cardImage' VÀO PROPS Ở ĐÂY
export default function LoginPromptModal({ isOpen, onClose, cardImage }) { 
  const [isSignUpHovered, setIsSignUpHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };
  
  const signUpButtonStyle = {
    ...styles.buttonBase,
    ...styles.signUpButton,
    transform: isSignUpHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const downloadButtonStyle = {
    ...styles.buttonBase,
    ...styles.downloadButton,
    borderColor: isDownloadHovered ? 'white' : '#737373',
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={handleModalContentClick}>
        <div style={styles.imageContainer}>
          {/* Dùng `cardImage` được truyền vào từ props */}
          <img 
            src={cardImage} 
            alt="Album Art" 
            style={styles.image}
          />
        </div>
        <div style={styles.content}>
          <h2 style={styles.title}>Start listening with a free Spotify account</h2>
          <button 
            style={signUpButtonStyle}
            onMouseEnter={() => setIsSignUpHovered(true)}
            onMouseLeave={() => setIsSignUpHovered(false)}
          >
            Sign up free
          </button>
          <button 
            style={downloadButtonStyle}
            onMouseEnter={() => setIsDownloadHovered(true)}
            onMouseLeave={() => setIsDownloadHovered(false)}
          >
            Download app
          </button>
          <p style={styles.loginText}>
            Already have an account?{' '}
            <a href="#" style={styles.loginLink}>
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}