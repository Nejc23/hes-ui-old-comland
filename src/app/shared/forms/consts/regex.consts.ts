export const regexPattern: RegExp = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/; // for dates 1. 8. 2018
export const regexPatternIso: RegExp = /'\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/; // for ISO dates: "2018-02-02T10:35:24+01:00"
