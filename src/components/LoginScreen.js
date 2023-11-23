// Importaciones necesarias
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

// Componente LoginScreen
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Datos que esperará UserService en el backend
    const loginData = {
      mail: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });


      if (response.status === 200) {
          console.log("--DONE--")
        const token = await response.text();
        console.log('Token recibido:', token);
      } else {
        
        // Si no es 200, asumo que es un mensaje de error
        const errorMsg = await response.text();
        console.error('Error en el inicio de sesión:', errorMsg);
      }
      
    } catch (error) {
      console.error('Error de red:', error);
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
