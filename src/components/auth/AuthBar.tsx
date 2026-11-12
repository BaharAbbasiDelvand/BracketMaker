import React, { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogIn, UserPlus, LogOut, ChevronDown } from "lucide-react";
import { isAuth0Configured } from "../../lib/auth0";
import "./auth-bar.css";

const AuthBarInner: React.FC = () => {
    const {
        isLoading,
        isAuthenticated,
        user,
        loginWithRedirect,
        logout,
    } = useAuth0();
    const [menuOpen, setMenuOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onDocClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    if (isLoading) {
        return (
            <div className="authbar">
                <div className="authbar__skeleton" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="authbar">
                <button
                    type="button"
                    className="authbar__login"
                    onClick={() => loginWithRedirect()}
                >
                    <LogIn size={16} strokeWidth={2.3} />
                    Log in
                </button>
                <button
                    type="button"
                    className="authbar__signup"
                    onClick={() =>
                        loginWithRedirect({
                            authorizationParams: { screen_hint: "signup" },
                        })
                    }
                >
                    <UserPlus size={16} strokeWidth={2.3} />
                    Sign up
                </button>
            </div>
        );
    }

    const displayName = user?.name || user?.email || "Account";
    const initial = displayName.trim().charAt(0).toUpperCase() || "U";

    return (
        <div className="authbar" ref={rootRef}>
            <button
                type="button"
                className="authbar__user"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
            >
                <span className="authbar__avatar">
                    {user?.picture ? (
                        <img src={user.picture} alt="" />
                    ) : (
                        initial
                    )}
                </span>
                <span className="authbar__name">{displayName}</span>
                <ChevronDown
                    size={15}
                    strokeWidth={2.4}
                    className={
                        menuOpen
                            ? "authbar__chev authbar__chev--open"
                            : "authbar__chev"
                    }
                />
            </button>

            {menuOpen && (
                <div className="authbar__menu" role="menu">
                    <div className="authbar__menu-head">
                        <span className="authbar__menu-name">
                            {user?.name || "Signed in"}
                        </span>
                        {user?.email && (
                            <span className="authbar__menu-email">
                                {user.email}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="authbar__logout"
                        onClick={() =>
                            logout({
                                logoutParams: {
                                    returnTo: window.location.origin,
                                },
                            })
                        }
                    >
                        <LogOut size={16} strokeWidth={2.3} />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
};

const AuthBar: React.FC = () => {
    if (!isAuth0Configured) {
        return null;
    }

    return <AuthBarInner />;
};

export default AuthBar;
