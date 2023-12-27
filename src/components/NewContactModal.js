import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { globalStyles } from '../styles/styles';
import usePost from '../hooks/usePost';
import ApiConstants from '../constants/ApiConstants';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactOwnerModal = ({ isVisible, onClose, ownerId, userId }) => {
    const [message, setMessage] = useState('');
    const { doPost, response, error, loading } = usePost(ApiConstants.BASE_URL + ApiConstants.COMMUNICATION_URL + ApiConstants.MESSAGES_ENDPOINT);

    const handleSendMessage = async () => {
        const messageData = {
            senderId: userId,
            receiverId: ownerId,
            content: message,
            answerTo: null, // lo pongo a null ya que es nuevo mensaje, no es una  respuesta a otro mensaje anterior
        };
        await doPost(messageData);
        console.log("Response:", response);
    };

    const handleClose = () => {
        onClose();
        setMessage('');
    };

    return (
        <Modal
            visible={isVisible}
            onRequestClose={handleClose}
            transparent={true}
            animationType="slide"
        >
            <View style={globalStyles.modalContainer}>
                <View style={globalStyles.modalContent}>
                    <TouchableOpacity style={globalStyles.closeButton} onPress={handleClose}>
                        <Icon name="close" size={20} />
                    </TouchableOpacity>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Escribe tu mensaje"
                        style={globalStyles.input}                   
                    />
                    <Button
                        title={loading ? 'Enviando...' : 'Enviar mensaje'}
                        onPress={handleSendMessage}
                        disabled={loading}
                        buttonStyle={globalStyles.loginButton} 
                        titleStyle={{ fontSize: 16 }}
                    />
                    {response && <Text style={globalStyles.greenText}>Mensaje enviado correctamente</Text>}
                    {error && <Text style={globalStyles.errorText}>{error.message}</Text>} 
                </View>
            </View>
        </Modal>
    );
};

export default ContactOwnerModal;
