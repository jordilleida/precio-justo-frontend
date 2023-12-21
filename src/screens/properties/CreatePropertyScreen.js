import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Button } from 'react-native-elements';
//import { launchImageLibrary } from 'react-native-image-picker';
import { globalStyles } from '../../styles/styles';
import ApiConstants from '../../constants/ApiConstants';
import debounce from 'lodash.debounce';
import usePost from '../../hooks/usePost';
import { storage } from '../../utils/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



const CreatePropertyScreen = () => {
    const [addressSearch, setAddressSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [images, setImages] = useState([]);
    const [registryDocument, setRegistryDocument] = useState(null);
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
    const propertyTypes = ["VIVIENDA", "PARKING", "LOCAL", "TERRENO", "TRASTERO"];

    const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
    const { doPost, response, error, loading } = usePost(`${ApiConstants.BASE_URL}${ApiConstants.PROPERTY_URL}${ApiConstants.CREATE_ENDPOINT}`);


   const fetchSuggestions = useCallback(debounce(async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=es`);
            const data = await response.json();
            console.log(data);
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
    const selectImage = () => {
        if (Platform.OS === 'web') {
            selectImageWeb();
        } else {
           /* 
            const options = {
                 
                };
        
            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    const source = { uri: response.uri };
                    setImages([...images, source]);
                    uploadImage(response.uri);
                }
            });
          */
        }
    };

    const selectImageWeb = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => {
            const files = e.target.files;
            Array.from(files).forEach(file => {
                uploadImage(file);
            });
        };
        input.click();
    };
    
    const uploadImage = async (file) => {
        try {
  
            const fileExtension = file.name.split('.').pop();
    
            const timestamp = Date.now();
            const fileName = `properties/${timestamp}.${fileExtension}`;
    
            const storage = getStorage();
            const imageRef = ref(storage, fileName);
    
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            setImages(prevImages => [...prevImages, { uri: downloadURL }]);
        } catch (error) {
            console.error('Error uploading image: ', error);
        }
    };

      const selectRegistryDocument = () => {

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            uploadRegistryDocument(file);
        };

        input.click();
    };
    
    const uploadRegistryDocument = async (file) => {
        try {

            const fileExtension = file.name.split('.').pop();
            const timestamp = Date.now();

            const storage = getStorage();
            const docRef = ref(storage, `registryDocuments/${timestamp}.${fileExtension}`);

            await uploadBytes(docRef, file);
            const downloadURL = await getDownloadURL(docRef);

            setRegistryDocument(downloadURL);

        } catch (error) {

            console.error('Error uploading document: ', error);
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
            imageUrls: images.map(img => img.uri),
            registryDocumentUrl: registryDocument
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
            <SelectDropdown
                data={propertyTypes}
                onSelect={(selectedItem, index) => {
                    setProperty({ ...property, type: selectedItem })
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    return item
                }}
                buttonStyle={[globalStyles.input, styles.quarterWidthInput]}
                defaultButtonText="Tipo de vivienda"
                buttonTextStyle={{ fontSize: 14 }}
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
        <Button 
            title="Seleccionar Imagen" onPress={selectImage} 
            buttonStyle={styles.buttonMargin}
        />

     
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
            {images.map((img, index) => (
                <Image key={index} source={{ uri: img.uri }} style={[{ width: 100, height: 100 }, styles.imageMargin]} />
            ))}
        </ScrollView>

        <Button 
            title="Seleccionar documento registral" onPress={selectRegistryDocument}
            buttonStyle={styles.buttonMargin}
         />
        {registryDocument && (
            <Image source={{ uri: registryDocument }} style={[{ width: 100, height: 100 }, styles.imageMargin]} />
        )}
        <Button
                title={loading ? 'Procesando...' : 'Enviar propiedad'}
                onPress={handleSubmit}
                disabled={loading}
                buttonStyle={globalStyles.bidButton}
            />
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
    imageMargin: {
        marginTop: 10,
        marginBottom: 10,
    },
    buttonMargin: {
        marginTop: 10,
        marginBottom: 10,
    },
    imageMargin: {
        margin: 10,
    },
    imageScrollView: {
        flexDirection: 'row',
    },

});

export default CreatePropertyScreen;
