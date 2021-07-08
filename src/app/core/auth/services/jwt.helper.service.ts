import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {
  constructor() {}

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        // eslint-disable-next-line no-throw-literal
        throw 'Illegal base64url string!';
    }
    return decodeURIComponent((window as any).escape(window.atob(output)));
  }

  public decodeToken(token: string = '') {
    if (token === null || token === '') {
      return { upn: '' };
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }
}
