const { resolve, relative } = require('path');
const { writeFileSync } = require('fs');

let args = process.argv;

const file = resolve(__dirname, 'src', 'environments', 'version.ts');
writeFileSync(file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
      /* tslint:disable */
      export const VERSION = {"version":"${args[2]}","hash":"${args[3]}"};
      /* tslint:enable */
      `, { encoding: 'utf-8' });

console.log(`Wrote version info ${args[2]}-${args[3]} to ${relative(resolve(__dirname, '..'), file)}`);
