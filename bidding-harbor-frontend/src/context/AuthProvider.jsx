import { useState } from "react";
import { AuthContext } from "./AuthContext";
import {
    getToken,
    getUser,
    saveToken,
    saveUser,
    clearStorage
} from "../utils/storage";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = getToken();
        const storedUser = getUser();

        if (token && storedUser) {
            return storedUser;
        }

        return null;
    });

    const [loading] = useState(false);

    const login = (token, userData) => {
        saveToken(token);
        saveUser(userData);
        setUser(userData);
    };

    const logout = () => {
        clearStorage();
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
