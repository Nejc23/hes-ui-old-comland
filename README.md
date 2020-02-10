# prerequisites
node: v10.16.2 +
npm: v6.9.3 + 
angular CLI: v8.3.4

# OtlmDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Docker Build

Run command  `docker build -t <image_name> -f .ops/Dockerfile . ` where <image_name> is name of image you want 
Curently used image name is eu.gcr.io/round-runner-126807/angular-template:unstable

## Running docker image

Run command  `docker run --rm --name <container_name> -p 51000:80 -d <image_name> ` where <image_name> is name of image you want and <container_name> is name of container

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Pact infractructure

U: pact
P: Jw0NE#9ihby2#

Pact broker infrastructure is stored in resources folder.
Access url https://otlm-pactbroker.comland.si:8443/ if it is not running run jenkins job https://jenkins-a.comland.si/view/infrastructure-comland/job/otlm_pact_broker/

## Pact commands
`npm run pact` - runs pact tests.
`npm run pact:publish` - publishes pact contract (json result from `npm run pact`) to pact broker server.

## Translation commands
`npm run translation` - creates/updates translation file. Location of translation files is `src/assets/i18n`.
Translation files can be updated in PoEdit editor.
