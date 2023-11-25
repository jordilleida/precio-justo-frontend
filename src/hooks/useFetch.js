import { useState, useEffect } from 'react';
import { makeRequest } from '../utils/networkServices';

const useFetch = (url, includeAuth = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeRequest(url, {}, includeAuth);
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url, includeAuth]);

    return { data, loading, error };
};

export default useFetch;
