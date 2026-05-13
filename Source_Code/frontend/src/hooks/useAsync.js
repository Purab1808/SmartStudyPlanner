import { useState } from 'react';

export default function useAsync(initialValue = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(initialValue);

  const run = async (promiseFactory) => {
    setLoading(true);
    setError('');
    try {
      const result = await promiseFactory();
      setData(result);
      return result;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Request failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, setData, setError, run };
}
