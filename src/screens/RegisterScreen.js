import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { registerUser } from '../services/UserService';
import { validateEmail } from '../utils/validation';
import { globalStyles } from '../styles/styles';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);

    const handleRegister = async () => {

        if (!name || !surname || !email || !password) {
            setError('Porfavor, completa todos los campos.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Porfavor, introduce un correo electrónico válido.');
            return;
        }

        setIsRegistering(true);
        try {
            const response = await registerUser(name, surname, email, password);
            setIsRegistering(false);
            if (response.success) {
                setRegistrationComplete(true);
            } else {
                console.log("Error en el registro");
            }
        } catch (error) {
            setIsRegistering(false);
            console.log("Error de conexión");
        }
        
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Página de registro</Text>
            {registrationComplete ? (
             <Text style={globalStyles.text}>Usuario registrado correctamente</Text>
            ) :  (
                <> 
                     {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

                    <TextInput style={globalStyles.input} placeholder="Nombre" value={name} onChangeText={setName} />
                    <TextInput style={globalStyles.input} placeholder="Apellido" value={surname} onChangeText={setSurname} />
                    <TextInput style={globalStyles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
                    <TextInput style={globalStyles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
                    {isRegistering ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button title="Registrame" onPress={handleRegister} disabled={isRegistering} buttonStyle={globalStyles.loginButton} />            
                    )}
                </>
            )}
        </View>
    );
};

export default RegisterScreen;
