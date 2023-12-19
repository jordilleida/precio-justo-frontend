import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import ApiConstants from '../../constants/ApiConstants';
import { globalStyles } from '../../styles/styles';
import { makeRequest } from '../../utils/networkServices';
import usePut from '../../hooks/usePut';

const ValidatePropertiesScreen = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { doPut } = usePut();

    const fetchPendingProperties = async () => {
        try {
            setLoading(true);
            const pendingUrl = `${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.PENDING_VALIDATION_ENDPOINT}`;
         
            const response = await makeRequest(pendingUrl);

            if(response.status == 204){
                setProperties([]); 
                return; 
            }

            if (!response.ok) {
                throw new Error('Error al cargar propiedades');
            }
            const data = await response.json();
            
            setProperties(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProperties();
    }, []);

    const handleValidate = async (propertyId) => {
        const validateUrl = `${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.VALIDATE_ENDPOINT}/${propertyId}`;
        console.log('URL de validación:', validateUrl);

        await doPut(`${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.VALIDATE_ENDPOINT}/${propertyId}`);
        fetchPendingProperties(); 
    };

    const handleInvalidate = async (propertyId) => {
        console.log(propertyId);
        await doPut(`${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.INVALIDATE_ENDPOINT}/${propertyId}`);
        fetchPendingProperties();
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <View style={globalStyles.container}><Text>Error: {error}</Text></View>;
    }

    const openURL = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("No se puede abrir el URL: " + url);
            }
        });
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.text}>Propiedades pendientes de validar</Text>
            {properties.length === 0 && (
                <Text style={globalStyles.emptyMessage}>Actualmente no hay propiedades para validar</Text>
            )}
            <FlatList
                data={properties}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={globalStyles.propertyItem}>
                        <Text style={globalStyles.propertyTitle}>{item.type} - {item.address}</Text>
                        <Text>Descripción: {item.description}</Text>
                        <Text>Habitaciones: {item.rooms}, Baños: {item.baths}</Text>
                        <Text>Superficie: {item.surface} m²</Text>
                        <Text>Referencia Catastral: {item.catastralReference}</Text>
                        <Text>Latitud: {item.latitude}, Longitud: {item.longitude}</Text>
                        <Text>Contacto: {item.contact}</Text>
                        <Text>Código Postal: {item.postalCode.code}, Ciudad: {item.postalCode.city.name}</Text>
                        <Text>Región: {item.postalCode.city.region.name}, País: {item.postalCode.city.region.country.name}</Text>
                        <View style={globalStyles.imageContainer}>
                            {item.images.map((image, index) => (
                                <Image key={index} source={{ uri: image.imageUrl }} style={globalStyles.propertyImage} />
                            ))}
                            <View>
                                <Text style={globalStyles.documentLabel}>Documento Registral:</Text>
                                <TouchableOpacity onPress={() => openURL(item.registryDocumentUrl)}>
                                    <Image source={{ uri: item.registryDocumentUrl }} style={globalStyles.propertyImage} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity style={globalStyles.bidButton} onPress={() => handleValidate(item.id)}>
                                <Text style={globalStyles.contactButtonText}>Validar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={globalStyles.deleteButton} onPress={() => handleInvalidate(item.id)}>
                                <Text style={globalStyles.contactButtonText}>Invalidar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default ValidatePropertiesScreen;
