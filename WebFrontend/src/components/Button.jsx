import React from 'react';
import '../style/Button.css'; // Import the CSS file for button styling

const Button = ({ text, type, onClick }) => {
    return (
        <button className={`button ${type}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
