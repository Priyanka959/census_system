import axios from 'axios';

const BASE_URL = globalThis.__API_BASE_URL__ || 'http://localhost:3000';

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