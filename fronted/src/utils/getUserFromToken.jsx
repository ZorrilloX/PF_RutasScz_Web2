import { jwtDecode } from 'jwt-decode';

const getUserFromToken = (token) => {
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

export default getUserFromToken;
