import React, { useState } from 'react';
import { Modal, View, TouchableOpacity,Text, Pressable } from 'react-native';
import { globalStyles } from '../styles/styles';
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
      <View style={globalStyles.modalContainer}>
        <View style={globalStyles.modalContent}>
          <TouchableOpacity style={globalStyles.closeButton} onPress={onClose}>
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
          {error !== '' && <Text style={globalStyles.errorText}>{error}</Text>}
          <Button title="Iniciar Sesión" onPress={handleLogin} buttonStyle={globalStyles.loginButton}/>
          <Pressable onPress={onRegisterPress}>
            <Text style={globalStyles.registerText}>Registrarse</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;
