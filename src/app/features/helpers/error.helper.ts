import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHelper {
  constructor() {}

  tryCastErrorToArrayOfStrings(error: any): Array<string> {
    try {
      if (error instanceof Array) {
        return error as Array<string>;
      } else if (typeof error === 'string') {
        if (error.indexOf('[') == 0 && error.indexOf(']') == error.length - 1) {
          let errors = error.substring(1, error.length - 1).split(','); // Remove first '[' and last ']' and split strings by ','.
          errors = errors.map((str) => (str[0] == '"' && str[str.length - 1] == '"' ? str.substring(1, str.length - 1) : str)); //  Remove '"' at start and end positions.

          return errors;
        } else {
          try {
            const jsonErr = JSON.parse(error);

            return jsonErr.message;
          } catch (_) {}
        }
      }
    } catch (_) {}

    return error;
  }
}
