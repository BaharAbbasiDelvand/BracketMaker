import React, { createContext, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthUserContext = createContext<string | null>(null);

export const useCurrentUserSub = (): string | null =>
    useContext(AuthUserContext);

const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated, user } = useAuth0();
    const sub = isAuthenticated ? user?.sub ?? null : null;

    return (
        <AuthUserContext.Provider value={sub}>
            {children}
        </AuthUserContext.Provider>
    );
};

export default AuthUserProvider;
