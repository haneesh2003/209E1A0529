import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NumManSer() {
  const [urls, setUrls] = useState([]);
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    fetchNumbers();
  }, [urls]);

  const fetchNumbers = async () => {
    if (urls.length === 0) {
      setNumbers([]);
      return;
    }

    try {
      const validResponses = await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await axios.get(url);
            if (response.status === 200 && response.data.numbers) {
              return response.data.numbers;
            }
          } catch (error) {
            console.error(`Error fetching numbers from ${url}:`, error);
          }
          return [];
        })
      );

      const mergedNumbers = Array.from(new Set(validResponses.flat())).sort((a, b) => a - b);
      setNumbers(mergedNumbers);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  const handleUrlChange = (e) => {
    const newUrls = [...urls, e.target.value];
    setUrls(newUrls);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Number Management Service</h1>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>URL:</label>
        <input type="text" onChange={handleUrlChange} style={{ marginLeft: '10px', padding: '5px' }} />
      </div>
      <div>
        <h2 style={{ marginBottom: '10px' }}>Numbers:</h2>
        {numbers.length > 0 ? (
          <ul style={{ paddingLeft: '20px' }}>
            {numbers.map((number) => (
              <li key={number}>{number}</li>
            ))}
          </ul>
        ) : (
          <p>No numbers to display.</p>
        )}
      </div>
    </div>
  );
}

export default NumManSer;
