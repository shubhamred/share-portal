# Development Info

## Development server

The development server is created using `webpack-dev-server` with
the react hot reloader.

to run the server:

```
$ npm run serve
```

## Storybook
To develop component in an isolated environemnt the system use
Storybook
https://github.com/kadirahq/react-storybook

to run the storybook platform:

```
$ npm run storybook
```


## Build production bundle
To build the production bundle run:

```
$ npm run build
```



## Project structure

#### Top Level

```
.
├── config                // the application configuration
│   ├─- default.js        // https://github.com/lorenwest/node-config
│   ├─- ...
│   └── production.js
├── dist                  // The dist folder
├── src                   // The source folder
│   └── js                // The app javascript folder
│   │ └── ...
│   ├─- index.html
│   └── styles.scss
├── tasks                 // The gulp tasks folder
├── tests                 // The common test folder, integration test should be put here
│   └── helpers
├── main.js               // Main file to be loaded for electron app
├── package.json
├── ...
└── README.md
```

#### JS app


```
src/js/
├── app.jsx                       // The app entry point
├── components                    // The folder containing reusable dumb components. Can come from a different repo
│   ├── navbar                    // A specific feature, if is simple keep the structure flat
│   │   ├── Navbar.jsx            // The dumb react component
│   │   ├── Navbar.story.jsx      // The storybook init file
│   │   ├── styles.scss           // The styles file 
│   │   └── tests                 // Tests for the dumb component
│   │       └── Navbar.spec.jsx
├── containers                    // The folder containing containers/ features
│   ├── header                    // A specific feature, if is simple keep the structure flat
│   │   ├── Header.jsx            // The dumb react component
│   │   ├── Header.story.jsx      // The storybook init file
│   │   ├── index.js              // The redux connector
│   │   └── styles.scss           // The styles file 
│   ├── sample
│   │   ├── ChildComponent.jsx
│   │   ├── index.js
│   │   └── test
│   │       └── ChildComponent.spec.jsx
│   └── user
│       ├── components            // If the component has a complex structure create a component folder
│       ├── index.js              // The entry point of the component, should export the part of the component
│       ├── reducers.js
│       └── sagas.js
├── layouts                       // The folder containing the layouts
│   └── mainLayout.jsx
├── pages                         // The App Pages realated to the router
│   ├── credits.jsx
│   ├── home.jsx
│   └── info.jsx
├── reducers                      // The app reducers
│   ├── app.js
│   ├── index.js                  // Root Reducer - All reducers should be added here
│   └── test
│       └── app.spec.js
├── routes.jsx                    // The route definition
├── sagas                         // The app saga
│   ├── index.js                  // Root Saga - All top level Sagas should be added here
│   ├── initAppFlow.js
│   └── test
│       └── initAppFlow.spec.js
├── services                      // The common services
└── store.js                      // The store init file
```

## Quality

We value quality, which is why we validate our code:


- Linting using [ESLint](http://eslint.org/)
- Unit testing using [Jest](https://facebook.github.io/jest/)
- End to end testing using [WebdriverIO](http://webdriver.io/)


> All of the above produce reports, you can find them in `./reports`, and even start
> a webserver to view the reports. Please see [`live-server`](https://www.npmjs.com/package/live-server) on npm.

## Linter

> Please notice that ESLint test runs will create a test report in `./report`

The code needs to conform to the specified ESLint rules.

To check run

```
$ npm run eslint
```

If you only want `eslint` to bork out on errors, do the following:

```
$ npm run eslint -- --quiet
```
Configuring the ESLint plugin in your editor will help in identifying linting issues earlier.

## Test

### Unit testing

> Config files for Jest can be found in `./config/jest`
> Please notice that Jest test runs will create a test report in `./report`

The application is tested using the following technologies:
 * jest - https://facebook.github.io/jest/
 * enzyme - http://airbnb.io/enzyme

to run the test:

```
$ npm test
```
#### File structure

The test should be added directly beside the file in a folder called
`test` and with an extension in the format `filename.spec.js`
or `filename.spec.jsx`

```
.
├── app
│   └── js
│     ├── ...
│     ├── fileToTest.js
│     └── test
│       └── fileToTest.spec.js
├── ...
└── ...
```
### End to end testing

> Please notice that WebdriverIO test runs will create a test report in `./report`

End to end testing provides a great way to determine if your code actually works from
an end user perspective. For this we use ['WebdriverIO'](http://webdriver.io/)


# Before you commit...

Both eslint and test are run while committing code to git.


### Logger
To log use the logger service provided instead of calling directly.
Calling the console log directly from the code is forbidden by a rule in eslint.
Is possible to use it in the development process but all the `console.log` should be removed before the commit.

The logger is initialized in the `app.jsx` and registered in the registry.

```
import logger from './services/logger';
...
logger.setLevel(6); // the log level is taken from the config file
registry.register('logger', logger);

```

The log levels are the following:

 * emerg: 0
 * alert: 1
 * crit: 2
 * error: 3
 * warning: 4
 * notice: 5
 * info: 6 // The default value
 * debug: 7

Tu use the logger in the code get it from the registry:

```
registry.get('logger').emerg('Some emerg message');
registry.get('logger').alert('Some alert message');
registry.get('logger').crit('Some crit message');
registry.get('logger').error('Some error message');
registry.get('logger').warning('Some warning message');
registry.get('logger').notice('Some notice message');
registry.get('logger').info('Some info message');
registry.get('logger').debug('Some debug message');
```
