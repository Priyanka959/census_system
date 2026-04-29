import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import { submitVote, updateVote, deleteVote, fetchAllData, fetchCounts, fetchResults } from '../src/api/census';

jest.mock('axios');

describe('census api', () => {
  beforeEach(() => {
    axios.post.mockReset();
    axios.put.mockReset();
    axios.delete.mockReset();
    axios.get.mockReset();
  });

  it('posts vote payloads', async () => {
    axios.post.mockResolvedValue({ data: { ok: true } });

    await submitVote({ name: 'Jane' });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/vote', { name: 'Jane' });
  });

  it('unwraps data responses for list endpoints', async () => {
    axios.get.mockResolvedValue({ data: { data: [{ id: 1 }] } });

    await expect(fetchAllData()).resolves.toEqual([{ id: 1 }]);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/data');
  });

  it('builds counts and results urls', async () => {
    axios.get.mockResolvedValue({ data: { data: [] } });

    await fetchCounts(true);
    await fetchResults();

    expect(axios.get).toHaveBeenNthCalledWith(1, 'http://localhost:3000/counts?is_vaccinated=true');
    expect(axios.get).toHaveBeenNthCalledWith(2, 'http://localhost:3000/results');
  });

  it('updates and deletes vote records', async () => {
    axios.put.mockResolvedValue({});
    axios.delete.mockResolvedValue({});

    await updateVote(7, { name: 'Jane' });
    await deleteVote(7);

    expect(axios.put).toHaveBeenCalledWith('http://localhost:3000/vote/7', { name: 'Jane' });
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/vote/7');
  });
});
