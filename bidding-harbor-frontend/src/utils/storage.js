const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
};

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const saveUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStorage = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};
