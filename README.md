# AngularCloudPoweredFirebaseDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Firebase Setup

The Firebase Command Line Interface (CLI) Tools can be used to test, manage, and deploy your Firebase project from the command line.
Run `npm install -g firebase-tools`

Run `firebase login` and your browser will open then login and allow to cli access

Run `firebase projects:list`

Run `npm install @angular/fire firebase@9.16.0 --legacy-peer-deps`

## tsconfig.json setup
Without this flag, TypeScript will allow you to use the dot syntax to access fields which are not defined:

Make sure to set following properties to false in tsconfig.json file:

```"compilerOptions": {
 ...
 ...
   "strict": false,
   "noPropertyAccessFromIndexSignature": false,
 ...
 ...
},
  "angularCompilerOptions": {
    "strictTemplates": false
  }```