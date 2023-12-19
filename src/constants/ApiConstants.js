const ApiConstants = {
    BASE_URL: 'http://localhost:8080/',

    USER_URL: 'user/',
    PROPERTY_URL: 'property/',
    AUCTION_URL: 'auction/',

    LOGIN_ENDPOINT: 'login',
    REGISTER_ENDPOINT: 'register', 
    USERS_LIST_ENDPOINT: 'users',
    ACTIVE_ENDPOINT: 'active',
    AUCTION_ENDPOINT: 'auction',
    BID_ENDPOINT: 'bid',
    PROPERTIES_ENDPOINT: 'properties',
    CREATE_ENDPOINT: 'create',
    DELETE_ENDPOINT: 'delete',
    VALIDATE_ENDPOINT: 'validate',
    INVALIDATE_ENDPOINT: 'invalidate',
    PENDING_VALIDATION_ENDPOINT: 'pending-validation',

    PENDING_VALIDATION: 'PENDING_VALIDATION',
    SOLD: 'SOLD',
    IN_AUCTION: 'IN_AUCTION',
};

export default ApiConstants;