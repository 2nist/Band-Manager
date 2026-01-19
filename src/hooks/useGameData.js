import { useState, useEffect } from 'react';

export function useGameData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Use import.meta.env.BASE_URL for correct path in production (GitHub Pages)
        // BASE_URL always ends with a slash, so we can safely append data/
        const baseUrl = import.meta.env.BASE_URL || '/';
        const gameUrl = `${baseUrl}data/gameData.json`;
        const eventsUrl = `${baseUrl}data/events.json`;
        
        console.log('Loading game data from:', { baseUrl, gameUrl, eventsUrl });
        
        const [gameResponse, eventsResponse] = await Promise.all([
          fetch(gameUrl),
          fetch(eventsUrl)
        ]);
        
        if (!gameResponse.ok) {
          const text = await gameResponse.text();
          console.error('Game data fetch failed:', gameResponse.status, text.substring(0, 200));
          throw new Error(`Failed to load gameData.json: ${gameResponse.status} - ${text.substring(0, 100)}`);
        }
        
        if (!eventsResponse.ok) {
          const text = await eventsResponse.text();
          console.error('Events data fetch failed:', eventsResponse.status, text.substring(0, 200));
          throw new Error(`Failed to load events.json: ${eventsResponse.status} - ${text.substring(0, 100)}`);
        }
        
        const [game, events] = await Promise.all([
          gameResponse.json(),
          eventsResponse.json()
        ]);
        
        setData({ ...game, ...events });
      } catch (err) {
        console.error('Error loading game data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
