import { fetchAuthSession } from 'aws-amplify/auth';

export const apiFetch = async (endpoint, options = {}) => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: `Bearer ${token}`
        };

        const response = await fetch(`http://localhost:8080${endpoint}`, {
            ...options,
            headers
        });

        return response;
    } catch (error) {
        console.error("Error de autenticación o de red en apiFetch:", error);
        throw error;
    }
};