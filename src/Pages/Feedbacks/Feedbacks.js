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
    <div className="Feedback" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div style={{ width: '80%', minWidth: '300px', marginBottom: '10px' }}>
        <h2 style={{marginBottom: '20px',fontSize : '30px'}}>Review and Evaluation</h2>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Comment..."
          style={{ width: '100%', height: '400px', marginBottom: '20px' ,fontSize : '20px'}}
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              style={{ fontSize: '30px', color: star <= rating ? 'orange' : 'grey', margin: '5px' }}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button
            style={{
              border: '2px solid #000',
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: 'green',
              fontSize: '20px',
              color : 'white'
            }}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;







