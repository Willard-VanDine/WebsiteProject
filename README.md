# How the files are organized
### Root Directory:
The highest level directory of the project. It contains a client folder for client-side code, 
and a server folder for server-side code, as well as a client_mockup folder for the first
sketch of the client-side application. The content of client_mockup is deprecated. 

### client/src:
- assets/ - Contains images used in the game.
- AccountPage.tsx - Component for the user account page, where you can see account scores.
- Container.tsx - Wrapper for layout management
- Content.tsx - Handles container content routes
- Footer.tsx - Footer component
- Gameboard.tsx & Gameboard.test.tsx - Gameboard UI for Rock Paper Scissors, and its test suite.
- Header.tsx - Header component
- Homepage.tsx - The homepage for the app, which is where you can subscribe to a new game of rock paper scissors, and get general rules and information about the game and app.
- Login.tsx & Register.tsx - Authentication pages for registering and logging in to an account with a unique username.
- Login.test.tsx & Register.test.tsx - Test Suites for Login & Register pages.
- Sidenav.tsx & Sidenav.test.tsx - Side navigation menu, located left side of the app, and test suite.
- api.ts - Handles API requests that a client can send from the app
- index.css - global cascading style sheets for the client app
- main.tsx - Entry point for react rendering, which creates the root of the document.
- useAuth.ts - Authentication hook

### server/db:
- accountStatsModel.db.ts - Defines the sequelize table for AccountStats
- accountmodel.db.ts - Defines the sequelize table for an Account
- conn.ts - Defines the database connection via Sequelize
- gamestateModel.db.ts - Defines the Gamestate table
- modelloader.ts - Defines relationships between all models, cascading properties, and exports all models.

### server/src:
- Model folder, containing interfaces and enums.
- Router folder, containing the router classes.
- Service folder, containing backend service classes and test suites for them.
- index.ts - defines the port to listen to.
- start.ts - sets up session secret, session, cors, and sets up express and routers.
- start.test.ts - test suite for router requests.

### server/src/model
- account.interface.ts - Interface defining the JSON structure of an Account
- choices.enum.ts - Enum defining the possible choices for a Rock, Paper, Scissors match.
- gamestate.interface.ts - Interface defining the JSON structure of a Gamestate
- loggedin.interface.ts - Interface defining the JSON structure of a login session response
- result.interface.ts - Interface defining the JSON structure of a result from a match
- usercontent.interface.ts - Interface defining the JSON structure of user content which is intended to be passed to the front-end as a response
- winnerOfGame.enum.ts - Enum defining the possible choices for a "winnerOfGame" state (You, Opponent, No winner yet)

### server/src/router
- account.router.ts - Defines the backend API requests used to communicate with the server in regards to accounts.
- gamestate.router.ts - Defines the backend API requests used to communicate with the server in regards to gamestate.

### server/src/service
- account.service.interface.ts - Defines the interface for an account service
- account.service.ts & account.service.oldtest.ts - Deprecated in-memory version of the database.
- accountDB.service.ts - Backend services for a database version of account services.
- accountdb.service.test.ts - Test Suite for accountDB.service.ts
- gamestate.service.interface.ts - Defines the interface for a gamestate service
- gamestate.service.ts & gamestate.service.oldtest.ts - Deprecated in-memory version of the database.
- gamestateDB.service.ts - Backend services for a database version of gamestate services
- gamestatedb.service.test.ts - Test Suite for gamestateDB.service.ts

# Where to find the final report
The final report is located in the Root Directory of the project!
It contains an introduction to the application, use cases, user manual (installation guide + use & navigation of app), 
design (components, backend API, database design), and project group responsibilities.

## Note regarding testing
The project has extensive testing for frontend, backend services, and routing. 
Seemingly, having an in-memory postgres database for testing is not supported by Sequelize (unlike sqlite), and as such, 
when running the tests it will use the current Postgres database connected to port 5432, 
and then **DROP ALL CONTENT OF ALL TABLES** for next time the tests are run.
We strongly advice that you open a fresh testing database on port 5432 before running server-side tests.
