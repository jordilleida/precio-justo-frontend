import { View, TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '../styles/styles';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Menu = ({ onMenuItemSelect, onPrecioJustoPress }) => {
    const { user, isAuthenticated } = useAuth();
    
    const hasRole = (role) => isAuthenticated && user?.roles?.includes(role);
    return (
        <View style={globalStyles.menu}>
            <TouchableOpacity style={globalStyles.menuItem} onPress={onPrecioJustoPress}>
                <Text>
                    <Text style={globalStyles.boldText}>PRECIO </Text>
                    <Text style={globalStyles.greenText}>JUSTO</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('item1')}>
                <Text>Subastas Activas</Text>
            </TouchableOpacity>
            {hasRole('BUYER') || hasRole('SELLER') ? (
                <>
                    <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('item2')}>
                        <Text>Mis mensajes</Text>
                    </TouchableOpacity>
                    </>
            ) : null}

            {hasRole('ADMIN') ? (
                <>
                    <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('UserList')}>
                        <Text>Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('item4')}>
                        <Text>Subastas</Text>
                    </TouchableOpacity>
                    </>
            ) : null}
            <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('item4')}>
                <Text><Icon name="plus" size={12} /> Agregar Inmueble</Text>
            </TouchableOpacity>
     
        </View>
    );
};

export default Menu;
