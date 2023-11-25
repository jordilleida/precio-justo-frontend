import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import useFetch from '../hooks/useFetch';
import ApiConstants from '../constants/ApiConstants';
import { globalStyles } from '../styles/styles';

const UserListScreen = () => {
    const { data: users, loading, error } = useFetch(ApiConstants.BASE_URL + ApiConstants.USERS_LIST_ENDPOINT);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error al cargar los usuarios: {error.message}</Text>;
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Lista de Usuarios</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <Text style={styles.userName}>{item.name} {item.surname}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <Text style={styles.userRole}>Rol: {item.roles.map(role => role.name).join(', ')}</Text>
                        <Text style={styles.userStatus}>{item.disabled ? 'Inactivo' : 'Activo'}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        width:200
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    userRole: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    userStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#32a852',
        marginTop: 10,
    },
});

export default UserListScreen;
