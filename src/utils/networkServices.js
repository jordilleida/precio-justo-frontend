import AsyncStorage from '@react-native-async-storage/async-storage';

export const makeRequest = async (url, options = {}, includeAuth = true) => {
    const headers = { ...options.headers };

    if (includeAuth) {
        const token = await AsyncStorage.getItem('accessToken');
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, { ...options, headers });
};