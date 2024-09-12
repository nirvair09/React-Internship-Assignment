import axios from 'axios';

const API_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number, rows: number) => {
   const response = await axios.get(`${API_URL}?page=${page}&limit=${rows}`);
   return response.data;
};
