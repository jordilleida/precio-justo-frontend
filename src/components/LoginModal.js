import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal, View, TouchableOpacity,Text, ActivityIndicator, Pressable } from 'react-native';
import { globalStyles } from '../styles/styles';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../services/UserService';

const LoginModal = ({ isVisible, onClose, onRegisterPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
        setIsLoading(true);
        setError('');
            try {
                const result = await login(email, password);
                setIsLoading(false);

                if (result.success) {
                    loginAuth({ roles: result.roles, name: result.name });
                    onClose();
                } else {
                    setError(result.errorMessage || 'Error en el inicio de sesión');
                }
            } catch (error) {
                setIsLoading(false);
                setError('Error en la conexión');
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
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button 
                    title="Iniciar Sesión" 
                    onPress={handleLogin} 
                    buttonStyle={globalStyles.loginButton} 
                    titleStyle={{ fontSize: 14 }}
                    disabled={isLoading}
                />
            )}
            <Pressable onPress={onRegisterPress}>
                <Text style={globalStyles.registerText}>Registrarse</Text>
            </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;
