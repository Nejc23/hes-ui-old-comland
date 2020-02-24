# prerequisites
node: v10.16.2 +
npm: v6.10 + 
angular CLI: v9.0.1
angular: v9.0.0

# Angular_template

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Docker Build

Run command  `docker build -t <image_name> -f .ops/Dockerfile . ` where <image_name> is name of image you want 
Curently used image name is eu.gcr.io/round-runner-126807/advance-hes:unstable

## Running docker image

Run command  `docker run --rm --name <container_name> -p 51000:80 -d <image_name> ` where <image_name> is name of image you want and <container_name> is name of container

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Pact infractructure

U: pactahes
P: ahesJw0NE#9ihby2#

Pact broker infrastructure is stored in resources folder.
Access url  https://advance-hes.comland.si:9443/ 

## Pact commands
`npm run pact` - runs pact tests.

## Translation commands
`npm run translation` - creates/updates translation file. Location of translation files is `src/assets/i18n`.
Translation files can be updated in PoEdit editor.
