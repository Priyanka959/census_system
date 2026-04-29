import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const unwrapData = (promise) =>
  promise.then(res => res.data.data);

export const submitVote = (payload) =>
  axios.post(`${BASE_URL}/vote`, payload);

export const updateVote = (id, payload) =>
  axios.put(`${BASE_URL}/vote/${id}`, payload);

export const deleteVote = (id) =>
  axios.delete(`${BASE_URL}/vote/${id}`);

export const fetchAllData = () =>
  unwrapData(axios.get(`${BASE_URL}/data`));

export const fetchCounts = (flag) =>
  unwrapData(axios.get(`${BASE_URL}/counts?is_vaccinated=${flag}`));

export const fetchResults = () =>
  unwrapData(axios.get(`${BASE_URL}/results`));