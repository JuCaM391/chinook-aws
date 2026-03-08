import axios from 'axios';

const API = axios.create({
  baseURL: 'http://54.165.60.186:8000'
});

export const getArtists = () => API.get('/artists/');
export const getAlbums = () => API.get('/albums/');
export const getTracks = (params) => API.get('/tracks/', { params });
export const getCustomers = () => API.get('/customers/');
export const createCustomer = (data) => API.post('/customers/', data);
export const purchase = (data) => API.post('/invoices/purchase', data);
