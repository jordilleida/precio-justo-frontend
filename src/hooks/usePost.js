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
            
            // Verifica si la respuesta es JSON o no
            const contentType = result.headers.get("content-type");
            let json;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                json = await result.json();
            } else {
                json = await result.text();
            }
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