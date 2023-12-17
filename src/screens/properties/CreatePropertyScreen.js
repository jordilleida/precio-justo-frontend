import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { globalStyles } from '../../styles/styles';
import ApiConstants from '../../constants/ApiConstants';
import debounce from 'lodash.debounce';
import usePost from '../../hooks/usePost';


const CreatePropertyScreen = () => {
    const [addressSearch, setAddressSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [property, setProperty] = useState({
        type: '',
        description: '',
        rooms: '',
        baths: '',
        surface: '',
        catastralReference: '',
        latitude: '',
        longitude: '',
        address: '',
        postalCode: '',
        city: '',
        region: '',
        country: ''
    });
    const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
    const { doPost, response, error, loading } = usePost(`${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.CREATE_ENDPOINT}`);

   const fetchSuggestions = useCallback(debounce(async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=es`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 500), []);

    useEffect(() => {
        if (addressSearch.length > 2 && !hasSelectedSuggestion) {
            fetchSuggestions(addressSearch);
        } else {
            setSuggestions([]);
        }
    }, [addressSearch, fetchSuggestions, hasSelectedSuggestion]);


    const handleSelectSuggestion = async (suggestion) => {

        setAddressSearch(suggestion.display_name);
        setHasSelectedSuggestion(true);
        // Intento dividir el atributo display_name y extraer la información para los campos que definirán la propiedad
        const parts = suggestion.display_name.split(', ');
        const address = parts.length > 0 ? parts[0] : ''; //la primera posición deberia ser la dirección por las pruebas qyue he hecho (dirección o plaza o el lugar que se busca)
        const postalCode = parts[parts.length - 2]; //(suele ser penultima posicion)
        const city = parts[parts.length - 4]; // siempre ciudad es la cuarta posiciion por detrás , en las pruebas que he hecho
        const region = parts[parts.length - 3]; //siempre es la antepenultima posición
        const country = parts[parts.length - 1]; // Parece que el país viene en la ultima posición

        setProperty({
            ...property,
            address: address,
            latitude: suggestion.lat,
            longitude: suggestion.lon,
            postalCode: postalCode || '',
            city: city || '',
            region: region || '',
            country: country || ''
        });

            setSuggestions([]);
        };

        const handleInputChange = (field, value) => {
            setProperty({ ...property, [field]: value });
        };

    const handleAddressSearchChange = (text) => {
        setAddressSearch(text);
        if (hasSelectedSuggestion) {
            setHasSelectedSuggestion(false);
        }
    };

    const handleSubmit = async () => {
 
        const propertyData = {
            type: property.type,
            description: property.description,
            rooms: parseInt(property.rooms),
            baths: parseInt(property.baths),
            surface: parseFloat(property.surface),
            catastralReference: property.catastralReference,
            latitude: parseFloat(property.latitude),
            longitude: parseFloat(property.longitude),
            address: property.address,
            postalCode: property.postalCode,
            city: property.city,
            region: property.region,
            country: property.country,
            registryDocumentUrl: "prueba.jpg"
        };
    
        await doPost(propertyData);

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={globalStyles.title}>Crear nueva propiedad</Text>

        <TextInput
                style={globalStyles.input}
                placeholder="Buscar dirección"
                value={addressSearch}
                onChangeText={handleAddressSearchChange}
            />
            {suggestions.length > 0 && (
                <FlatList
                    style={styles.dropdown}
                    data={suggestions}
                    keyExtractor={(item, index) => `${item.place_id}-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
                            <Text>{item.display_name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

        
        <View style={styles.inputRow}>
            <TextInput
                style={[globalStyles.input]}
                placeholder="Descripción de la propiedad"
                value={property.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
            />

            <TextInput
                style={[globalStyles.input]}
                placeholder="Dirección"
                value={property.address}
                onChangeText={(text) => handleInputChange('address', text)}
            />
        </View>

        {/* Fila para Tipo de propiedad, Número de habitaciones, Número de baños, y Superficie */}
        <View style={styles.inputRow}>
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Tipo de propiedad"
                value={property.type}
                onChangeText={(text) => handleInputChange('type', text)}
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Número de habitaciones"
                value={property.rooms}
                onChangeText={(text) => handleInputChange('rooms', text)}
                keyboardType="numeric"
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Número de baños"
                value={property.baths}
                onChangeText={(text) => handleInputChange('baths', text)}
                keyboardType="numeric"
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Superficie (m²)"
                value={property.surface}
                onChangeText={(text) => handleInputChange('surface', text)}
                keyboardType="numeric"
            />
        </View>

        <View style={styles.inputRow}>
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Referencia catastral"
                value={property.catastralReference}
                onChangeText={(text) => handleInputChange('catastralReference', text)}
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Latitud"
                value={property.latitude}
                onChangeText={(text) => handleInputChange('latitude', text)}
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Longitud"
                value={property.longitude}
                onChangeText={(text) => handleInputChange('longitude', text)}
            />
          
        </View>

        <View style={styles.inputRow}>
            <TextInput
                    style={[globalStyles.input, styles.quarterWidthInput]}
                    placeholder="Código Postal"
                    value={property.postalCode}
                    onChangeText={(text) => handleInputChange('postalCode', text)}
             />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Ciudad"
                value={property.city}
                onChangeText={(text) => handleInputChange('city', text)}
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="Región"
                value={property.region}
                onChangeText={(text) => handleInputChange('region', text)}
            />
            <TextInput
                style={[globalStyles.input, styles.quarterWidthInput]}
                placeholder="País"
                value={property.country}
                onChangeText={(text) => handleInputChange('country', text)}
            />
        </View>
        <Button title={loading ? 'Procesando...' : 'Enviar propiedad'} onPress={handleSubmit} disabled={loading} />
            {response && <Text style={globalStyles.greenText}>{response}</Text>}
            {error && <Text style={globalStyles.errorText}>{error.message}</Text>}
       
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        marginTop: 4,
        maxHeight: 400,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    quarterWidthInput: {
        flex: 1,
        marginHorizontal: 5,
    },
 

});

export default CreatePropertyScreen;
