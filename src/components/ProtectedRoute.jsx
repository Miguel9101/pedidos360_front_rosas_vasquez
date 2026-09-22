import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkRoles = async () => {
            try {
                const session = await fetchAuthSession();
                // AWS Cognito inyecta los roles en el arreglo "cognito:groups"
                const roles = session.tokens?.idToken?.payload['cognito:groups'] || [];
                
                if (requiredRole && !roles.includes(requiredRole)) {
                    setIsAuthorized(false);
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                setIsAuthorized(false);
            }
        };
        checkRoles();
    }, [requiredRole]);

    if (isAuthorized === null) return <div>Cargando permisos...</div>;
    
    return isAuthorized ? children : <Navigate to="/no-autorizado" />;
};