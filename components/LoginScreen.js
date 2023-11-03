// Importaciones necesarias
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

// Componente LoginScreen
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Datos que esperará el backend
    const loginData = {
      mail: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:18084/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const json = await response.json();
      if (response.ok) {
        console.log('Inicio de sesión exitoso:', json);
        console.log('El token es:', json.token);
      } else {
        console.error('Error en el inicio de sesión:', json);
        // Manejar errores como credenciales incorrectas, etc.
      }
    } catch (error) {
      console.error('Error de red:', error);
      // Manejar errores de red
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 15,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default LoginScreen;
