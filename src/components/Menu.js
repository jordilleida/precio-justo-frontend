import { View, TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '../styles/styles';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Menu = ({ onMenuItemSelect, onPrecioJustoPress }) => {
    const { user, isAuthenticated } = useAuth();
   
     const hasRole = (role) => {
        if (!isAuthenticated || !user?.roles) return false;
    
        const trimmedRole = role.trim();
        return user.roles.some(userRole => userRole.trim() === trimmedRole);
    };

    return (
        <View style={globalStyles.menu}>
            <TouchableOpacity style={globalStyles.menuItem} onPress={onPrecioJustoPress}>
                <Text>
                    <Text style={globalStyles.boldText}>PRECIO </Text>
                    <Text style={globalStyles.greenText}>JUSTO</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('ActiveAuctions')}>
                <Text>Subastas Activas</Text>
            </TouchableOpacity>
            {hasRole('BUYER') || hasRole('SELLER') ? (
                <>
                    <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('item2')}>
                        <Text>Mis mensajes</Text>
                    </TouchableOpacity>
                    </>
            ) : null}
            
            {hasRole('SELLER') ? (
                <>
                    <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('ActiveProperties')}>
                        <Text>Mis inmuebles</Text>
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

            {hasRole('BUYER') || hasRole('SELLER') ? (
                   <TouchableOpacity style={globalStyles.menuItem} onPress={() => onMenuItemSelect('item4')}>
                   <Text><Icon name="plus" size={12} /> Agregar Inmueble</Text>
                     </TouchableOpacity>
            ) : null}
       
     
        </View>
    );
};

export default Menu;
