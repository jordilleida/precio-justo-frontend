import { useState } from 'react';
import { makeRequest } from '../utils/networkServices';

const usePut = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const doPut = async (url) => {
        setLoading(true);
        try {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            };

            const result = await makeRequest(url, requestOptions);
            const json = await result.json();
            setResponse(json);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { doPut, response, error, loading };
};

export default usePut;
