export const config = {
  // AUTH SETTINGS
  authCookie: 'authcookie', // name of the cookie
  authCookieExp: 'authcookieexp',
  authTimeStamp: 'authtimestamp',
  authType: 'authType',
  authRefreshBeforeMinutes: -5, // minutes before which we should refresh token
  authRefreshInterval: 1 /*minutes */ * 60000, // refresh interval
  authTokenDuration: 110 // minutes after refresh is no longer possible (inactivity of user)
};
