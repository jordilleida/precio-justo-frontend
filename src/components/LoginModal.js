import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text, Pressable } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../services/UserService';

const LoginModal = ({ isVisible, onClose, onRegisterPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response.ok) {
        const token = await response.json();
        console.log('Token recibido:', token);
        onClose(); // Cierra el modal después del login
      } else {
        setError('Error en el inicio de sesión'); // Manejo del error
      }
    } catch (error) {
      setError('Error en la conexión'); // Error en la petición
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={20} />
          </TouchableOpacity>
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <Button title="Iniciar Sesión" onPress={handleLogin} />
          <Pressable onPress={onRegisterPress}>
            <Text style={styles.registerText}>Registrarse</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

// Estilos
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    width: '80%', 
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },
  registerText: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
});

export default LoginModal;
