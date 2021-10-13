# Prerequisites

- node: v10.16.2 +
- npm: v6.10 +
- angular CLI: v12.1.0+
- angular: v12.1.0+

## Prepare development machine

Get the code from the GIT repo.

> You need to install the latest version of Visual Studio including the "Desktop development with C++" workload.

Open powershell as an admin and go to the project root folder.

```bash
npm install -g npm
npm install -g typescript
npm install -g @angular/cli
npm install -g windows-build-tools
npm install
```

NPM install should be successful.

## Development server

Run `npm run start` for a dev server. Navigate to `https://localhost:4200/`. It runs on **HTTPS**. First time you need
to add certificate exception in browser when calling local backend. The app will automatically reload if you change any
of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag
for a production build.

## Docker Build

There are few brands which you can use for CONFIGURATION argument:

- production-ePointHES
- production-myGrid
- production-amera

If you do not specify it, the build will be create with `ng build --prod`.

Docker also accepts 2 additional parameters for versioning `SEMVER` and `GITHASH`.

If you build the image for Windows or Linux use `Dockerfile.win` and `Dockerfile.linux` respectively.

Examples for Dockerfile.linux:

```powershell
//Build default docker image
docker build -f Dockerfile.linux -t defaulthes:latest --build-arg SEMVER=1.0 --build-arg GITHASH=f346534 .

//build for epoint
docker build -f Dockerfile.linux -t epointhes:latest --build-arg CONFIGURATION=production-ePointHES --build-arg SEMVER=1.0 --build-arg GITHASH=f346534 .

//build for mygrid
docker build -f Dockerfile.linux -t mygrid:latest --build-arg CONFIGURATION=production-myGrid --build-arg SEMVER=1.0 --build-arg GITHASH=f346534 .

//build for amera
docker build -f Dockerfile.linux -t amera:latest --build-arg CONFIGURATION=production-amera --build-arg SEMVER=1.0 --build-arg GITHASH=f346534 .
```

## Running docker image

Examples:

```powershell
docker container run --rm --name defaulthes -p 4200:80 -d default:latest

docker container run --rm --name epointhes -p 4201:80 -d epointhes:latest

docker container run --rm --name mygrid -p 4202:80 -d mygrid:latest

docker container run --rm --name amera -p 4203:80 -d amera:latest
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Pact infractructure

U: pactahes P: ahesJw0NE#9ihby2#

Pact broker infrastructure is stored in resources folder. Access url  https://advance-hes.comland.si:9443/

## Pact commands

`npm run pact` - runs pact tests.

## Translation commands

`npm run build-and-extract-i18n` - creates/updates translation file. Location of translation files is `src/assets/i18n`.
Translation files can be updated in PoEdit editor.

## Production build

`npm install`

`npm run postinstall`

`npm run build-production[:myGrid][:amera][:ePointHES]`

## Production build with JScrambler - JavaScript obfuscator

`npm run build-production:myGrid:jscr`
`npm run build-production:amera:jscr`
`npm run build-production:ePointHES:jscr`
