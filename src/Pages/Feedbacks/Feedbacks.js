import React, { useState } from 'react';

function Feedback() {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  return (
    <div className="Feedback" style={styles.feedbackContainer}>
      <div style={styles.innerContainer}>
        <h2 style={styles.heading}>Review and Evaluation</h2>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Comment..."
          style={styles.textarea}
        />
        <div style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              style={{ ...styles.starButton, color: star <= rating ? 'orange' : 'grey' }}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </button>
          ))}
        </div>
        <div style={styles.submitContainer}>
          <button style={styles.submitButton}>Submit Review</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  feedbackContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
    padding: '10px',
  },
  innerContainer: {
    width: '80%',
    minWidth: '300px',
    marginBottom: '10px',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '30px',
  },
  textarea: {
    width: '100%',
    height: '400px',
    marginBottom: '20px',
    fontSize: '20px',
  },
  ratingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  starButton: {
    fontSize: '30px',
    margin: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  submitButton: {
    border: '2px solid #000',
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: 'green',
    fontSize: '20px',
    color: 'white',
  },
  '@media (max-width: 768px)': {
    textarea: {
      height: '200px',
    },
    heading: {
      fontSize: '24px',
    },
    starButton: {
      fontSize: '24px',
    },
    submitButton: {
      padding: '8px 16px',
      fontSize: '16px',
    },
  },
  '@media (max-width: 480px)': {
    textarea: {
      height: '150px',
    },
    heading: {
      fontSize: '20px',
    },
    starButton: {
      fontSize: '20px',
    },
    submitButton: {
      padding: '6px 12px',
      fontSize: '14px',
    },
  },
};

export default Feedback;
