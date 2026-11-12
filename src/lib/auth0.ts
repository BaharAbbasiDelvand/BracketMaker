export const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
export const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

export const isAuth0Configured = Boolean(auth0Domain && auth0ClientId);
