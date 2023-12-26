import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/styles';
import { useAuth } from '../../context/AuthContext';
import ApiConstants from '../../constants/ApiConstants';
import { makeRequest } from '../../utils/networkServices'; 
import usePost from '../../hooks/usePost';
import moment from 'moment';

const ChatMessagesScreen = () => {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [initialMessages, setInitialMessages] = useState([]);
    const [messageReplies, setMessageReplies] = useState([]);
    const [reload, setReload] = useState(false);
    const { user } = useAuth();
    const { doPost } = usePost(ApiConstants.BASE_URL + ApiConstants.COMMUNICATION_URL + ApiConstants.MESSAGES_ENDPOINT, true);

    const fetchInitialMessages = useCallback(async () => {
        try {
            const response = await makeRequest(ApiConstants.BASE_URL + ApiConstants.COMMUNICATION_URL + ApiConstants.MESSAGES_ENDPOINT + '/' + user.id);
            const data = await response.json();
            setInitialMessages(data);
        } catch (error) {
            console.error('Error al cargar mensajes iniciales:', error);
        }
    }, [user.id]);

    const fetchMessageReplies = useCallback(async (messageId) => {
        try {
            const response = await makeRequest(ApiConstants.BASE_URL + ApiConstants.COMMUNICATION_URL + ApiConstants.MESSAGES_REPLIES_ENDPOINT + '/' + messageId);
            const data = await response.json();
            setMessageReplies(data);
        } catch (error) {
            console.error('Error al cargar respuestas:', error);
        }
    }, []);

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };
    
    useEffect(() => {
        fetchInitialMessages();
    }, [fetchInitialMessages, reload]);

    useEffect(() => {
        if (selectedMessage) {
            fetchMessageReplies(selectedMessage.id);
        }
    }, [selectedMessage, fetchMessageReplies, reload]);


    const handleMessageSend = async () => {
        if (!newMessage.trim()) return;

        const lastMessageId = messageReplies.length > 0 ? messageReplies[messageReplies.length - 1].id : selectedMessage.id;
        const receiverId = selectedMessage.senderId === user.id ? selectedMessage.receiverId : selectedMessage.senderId;

        const messageToSend = {
            senderId: user.id,
            receiverId: receiverId,
            content: newMessage,
            answerTo: lastMessageId,
        };

        try {
            await doPost(messageToSend);

            // Actualizar la lista de mensajes
            setReload(!reload);

        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }

        setNewMessage('');
    };

    const formatSendDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };

    const isMessageFromUser = (messageSenderId) => {
        return messageSenderId === user.id;
    };

    return (
        <View style={styles.chatContainer}>
            {/* Columna de mensajes iniciales */}
            <View style={styles.initialMessagesPanel}>
                {initialMessages && initialMessages.map((message) => (
                    <View key={message.id} style={styles.messageCard}>
                        <TouchableOpacity onPress={() => handleSelectMessage(message)}>
                            <Text style={styles.messageContent}>{message.content}</Text>
                        </TouchableOpacity>
                        <Text style={styles.messageInfo}>Usuario: {message.senderId === user.id ? message.receiverId : message.senderId}</Text>
                        <Text style={styles.messageInfo}>Fecha: {formatSendDate(message.sendDate)}</Text>
                    </View>
                ))}
            </View>
            
            {/* Columna de conversación */}
            <View style={styles.conversationPanel}>
                <ScrollView style={styles.messagesList}>
                    {selectedMessage && (
                        <View style={[styles.chatMessage, isMessageFromUser(selectedMessage.senderId) ? styles.messageFromUser : styles.messageFromOthers]}>
                            <Text style={styles.chatMessageText}>{selectedMessage.content}</Text>
                            <Text style={styles.messageDate}>{formatSendDate(selectedMessage.sendDate)}</Text>
                        </View>
                    )}
                    {messageReplies && messageReplies.map((reply) => (
                        <View key={reply.id} style={[styles.chatMessage, isMessageFromUser(reply.senderId) ? styles.messageFromUser : styles.messageFromOthers]}>
                            <Text style={styles.chatMessageText}>{reply.content}</Text>
                            <Text style={styles.messageDate}>{formatSendDate(reply.sendDate)}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.messageInputContainer}>
                    <TextInput 
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Escribe un mensaje..."
                        style={styles.messageInput}
                    />
                    <TouchableOpacity onPress={handleMessageSend} style={styles.sendButton}>
                        <Text>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Estilos adicionales para el chat
const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    initialMessagesPanel: {
        flex: 1, 
        padding: 10,
        borderRightWidth: 1, 
        borderColor: '#ccc',
    },
    conversationPanel: {
        flex: 2,
        padding: 10,
    },
    messageCard: {
        marginBottom: 10,
        padding: 5,
    },
    messageContent: {
        fontWeight: 'bold',
    },
    messageInfo: {
        fontSize: 12,
        color: '#666',
    },
    replyText: {
        marginBottom: 5,
    },
    sendButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        padding: 10,
        alignItems: 'center',
    },
    conversationPanel: {
        flex: 2,
        padding: 10,
        justifyContent: 'space-between',
    },
    messagesList: {
        flex: 1,
    },

    chatMessage: {
        marginBottom: 5,
        padding: 10,
        borderRadius: 5,
    },
    messageFromUser: {
        backgroundColor: '#dbebd5',
        alignSelf: 'flex-end',
    },
    messageFromOthers: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
    },
    chatMessageText: {
        fontWeight: 'bold',
    },
    messageDate: {
        fontSize: 12,
        color: '#666',
        alignSelf: 'flex-end',
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4c9c2e',
        padding: 10,
        alignItems: 'center',
    }
});

export default ChatMessagesScreen;
