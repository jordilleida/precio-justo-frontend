import ApiConstants from '../constants/ApiConstants';

export const login = async (email, password) => {
    const response = await fetch(ApiConstants.BASE_URL + ApiConstants.LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email, password }),
    });
    if (response.ok) {
        const { idToken, accessToken } = await response.json();
        // Almacenar tokens
        storeToken('accessToken', accessToken);
        storeToken('idToken', idToken);
    }
    return response;
};

const storeToken = (key, token) => {
    console.log(key, token);
    // Implementa el almacenamiento del token, por ejemplo, utilizando AsyncStorage
};