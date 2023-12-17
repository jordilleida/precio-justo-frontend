import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import ApiConstants from '../../constants/ApiConstants';
import { useAuth } from '../../context/AuthContext';
import { globalStyles } from '../../styles/styles';
import { makeRequest } from '../../utils/networkServices';
import NewAuctionModal from '../../components/NewAuctionModal';

const ActivePropertiesScreen = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shouldReload, setShouldReload] = useState(false);
    const [isNewAuctionModalVisible, setIsNewAuctionModalVisible] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await makeRequest(`${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.PROPERTIES_ENDPOINT}/${user.id}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await response.json();
            setProperties(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [shouldReload]);

    const deleteProperty = async (propertyId) => {
        try {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            };
            const deleteResponse = await makeRequest(`${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.DELETE_ENDPOINT}/${propertyId}`, requestOptions);
            if (!deleteResponse.ok) {
                throw new Error('Error al eliminar la propiedad');
            }
            setShouldReload(prev => !prev);

        } catch (err) {
            setError(err);
        }
    };

    const handleAuctionPress = (propertyId) => {
        setSelectedPropertyId(propertyId);
        setIsNewAuctionModalVisible(true);
    };

    const handleDeletePress = (propertyId) => {
        deleteProperty(propertyId);
    };

    const onAuctionSuccess = () => {
        setIsNewAuctionModalVisible(false);
        setShouldReload(prev => !prev);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <View style={globalStyles.container}><Text>Error: {error.message}</Text></View>;
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.text}>Propiedades del usuario</Text>
            <FlatList
                data={properties}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={globalStyles.propertyItem}>
                        <Text style={globalStyles.propertyTitle}>{item.type} - {item.address}</Text>
                        <Text>Descripción: {item.description}</Text>
                        <Text>Habitaciones: {item.rooms}, Baños: {item.baths}</Text>
                        <Text>Superficie: {item.surface} m²</Text>
                        <Text style={globalStyles.currentPrice}>Estado: {item.status}</Text>
                        <View style={globalStyles.imageContainer}>
                            {item.images.map(image => (
                                <Image key={image.id} source={{ uri: image.imageUrl }} style={globalStyles.propertyImage} />
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            {item.status !== ApiConstants.SOLD && (
                                <>
                                    {item.status !== ApiConstants.PENDING_VALIDATION && (
                                        <TouchableOpacity style={globalStyles.bidButton} onPress={() => handleAuctionPress(item.id)}>
                                            <Text style={globalStyles.contactButtonText}>Subastar</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={globalStyles.deleteButton} onPress={() => handleDeletePress(item.id)}>
                                        <Text style={globalStyles.contactButtonText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                )}
            />
            <NewAuctionModal
                isVisible={isNewAuctionModalVisible}
                onClose={() => setIsNewAuctionModalVisible(false)}
                propertyId={selectedPropertyId}
                onAuctionSuccess={onAuctionSuccess}
            />
        </View>
    );
};

export default ActivePropertiesScreen;
