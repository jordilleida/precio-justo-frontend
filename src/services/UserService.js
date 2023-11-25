import ApiConstants from '../constants/ApiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
    const response = await fetch(ApiConstants.BASE_URL + ApiConstants.LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email, password }),
    });
    if (response.ok) {
        const { accessToken } = await response.json();
        // Almacenar tokens
        storeToken('accessToken', accessToken);

        // Extrae los datos del usuario del accessToken
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userData = {
            roles: payload.roles ? payload.roles.split(',') : [],
            name: payload.name
        };

        return { success: true, ...userData };
    } else {
        const errorMessage = await response.text();
        return { success: false, errorMessage };
    }
};

export const registerUser = async (name, surname, email, password) => {
    const response = await fetch(ApiConstants.BASE_URL + ApiConstants.REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, mail: email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        return { success: true, data };
    } else {
        const errorMessage = await response.text();
        return { success: false, errorMessage };
    }
};

const storeToken = async (key, token) => {
    try {
        await AsyncStorage.setItem(key, token);
    } catch (error) {
        console.log("Error al almacenar");
    }
};