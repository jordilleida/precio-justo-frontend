import { useState } from 'react';
import { makeRequest } from '../utils/networkServices';

const usePost = (url, includeAuth = true) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const doPost = async (data) => {
        setLoading(true);
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            };
            const result = await makeRequest(url, requestOptions, includeAuth);
            const json = await result.json();
            setResponse(json);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { doPost, response, error, loading };
};

export default usePost;