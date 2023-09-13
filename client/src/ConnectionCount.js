import React, { useEffect, useState } from 'react';

function ConnectionCount() {
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/connection-count')
      .then((response) => response.json())
      .then((data) => {
        setConnectionCount(data.connectionCount);
      })
      .catch((error) => {
        console.error('Error fetching connection count: ', error);
      });
  }, []);

  return (
    <div className="connection-count">
      <p>Connection Count: {connectionCount}</p>
    </div>
  );
}

export default ConnectionCount;
