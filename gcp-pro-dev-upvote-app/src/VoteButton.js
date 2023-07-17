import React, { useState } from 'react';
import './VoteButton.css';

function VoteButton() {
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState(false);

  function handleClick() {
    fetch(process.env.REACT_APP_VOTE_API_URL, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vote: 1 })
    }).then (response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    }).then(data => {
      console.log(data);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }).catch(error => {
      console.error(error);
      setError(true);
      error.json().then(data => {
        setError(`Failed to cast vote. Response: "${data.message}"`)
      }).catch(() => {
        setError(`Failed to cast vote: ${error.statusText}`)
      });
      setTimeout(() => {
        setError(false);
      }, 2000);
    });
  }

  return (
    <div className="vote-button-container">
      <button onClick={handleClick} type="button">
        Cast your vote
      </button>
      {showMessage && <div className="vote-button-message">Thanks for voting!</div>}
      {error && <div className="vote-button-error">{error}</div>}
    </div>
  );
}

export default VoteButton;