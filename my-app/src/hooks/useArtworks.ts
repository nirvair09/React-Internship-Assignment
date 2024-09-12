import { useState, useEffect } from 'react';
import { fetchArtworks } from '../api/artworks';

export const useArtworks = (page: number, rows: number) => {
   const [artworks, setArtworks] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const getArtworks = async () => {
         setLoading(true);
         const data = await fetchArtworks(page, rows);
         setArtworks(data.data);
         setLoading(false);
      };

      getArtworks();
   }, [page, rows]);

   return { artworks, loading };
};
