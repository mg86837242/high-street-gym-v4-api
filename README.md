# High Street Gym v3

A gym website project created for school work.

## 🛠️ Quick Start

**Step 1**: To run this app, clone the repository and install dependencies:

```bash
git clone https://github.com/mg86837242/high-street-gym-v3.git

cd high-street-gym-v3

npm install
```

**Step 2**: Install (if necessary) and open MySQL Workbench to import dataset. Steps for using the MySQL Workbench tool:

    1.  Administration – data import/restore
    2.  Import from self-contained file
    3.  Select the dump file located at `./high-street-gym-v3/api/var`
    4.  Start import

Configure `mysql2` [options](https://github.com/sidorares/node-mysql2#using-connection-pools) in `./pool.js`.

**Step 3**: Then start the Express server (backend) and Vite (frontend):

```bash
npm start
```

Navigate to [`http://localhost:5173`](http://localhost:5173).

## 📖 Dev Use Only

### 1. ✅ To-Do List

#### 1.1 👨🏽‍💻 Coding

- [x] Database Modeling
  - [x] Research gym group activities
  - [x] Research the business logic of a gym booking system
- [x] Models
- [x] Controllers/Routers <!-- See: https://softwareengineering.stackexchange.com/questions/135495/in-mvc-what-is-the-difference-between-controller-and-router -->
  - [x] Code controllers by using promises' instance methods `then()` and `catch()`
  - [x] Refactor controllers by using `try...catch` and `async/await`
  - [x] Validation and error handling
  - [x] Authentication and authorization logic in `loginController`， `memberController` and `trainerController`
  - [x] Refine the create and update operations in `memberController` and `trainerController`, and to a lesser degree, `bookingController`, `activityController` and `blogController` as the latter three can be defined on spot whenever a frontend logic calls for it
  - [x] XML template and `exportController`
  - [x] SQL transactions
  - [x] Role-based access control (RBAC) middleware
- [x] Views
  - [x] General
    - [x] Client-side routing (CSR)
    - [x] Static asset management
    - [x] Utilize library components along the way
    - [x] Apply Tailwind CSS utility classes and responsive design along the way
    - [x] Extract custom styles and reusable components along the way
  - [x] Page layout, homepage, and error page
  - [x] Bookings page
    - [x] Calendar table
    - [x] Map calendar date to a list of bookings
    - [x] CRUD operations for a single booking
    - [x] Breadcrumbs and global pending UI
  - [x] Login/logout/signup pages
    - [x] Backend authentication APIs (login, logout and signup)
    - [x] React context for authentication
    - [x] Login and signup forms and client-side validation
    - [x] Client-side RBAC
  - [ ] Blog page
  - [ ] Misc.

#### 1.2 🔍 Research

- [x] React 18 – JavaScript library for building UI
- [x] Vite – for scaffolding, frontend server and bundling
- [x] Git – for version control
- [x] Prettier – for code formatting, subsequently improving code consistency and readability
- [x] ESLint – for code quality, subsequently improving code consistency and readability
- [x] Sequelize – ORM for data modeling, seeding, migration and validation (abandoned because (1) ES7 can deal with the relations/associations in a more suitable way, and (2) there is more granular control over the controller design in order to smooth a path for the integration of React Router)
- [x] Zod – for backend validation and associated error handling
- [x] Redis – for session stores
- [x] React Router – for client side routing, client-side error handling, data fetching and loading, form action and `FormData`, global pending UI, etc.
- [x] Tailwind CSS – utility-class CSS framework for rapid UI development
- [x] Fontsource – for fonts delivery
- [ ] Supabase – for authentication services
- [ ] ...

#### 1.3 🪲 Known Issues

- [ ] Vite's import resolver errors reported by ESLint in the backend/api
  - To reproduce this error:
    - Comment out line 16 but keep line 20~24 in `./.eslintrc.cjs`, then run `npm run lint` script in the terminal, OR
    - Comment out line 20~24 but keep line 16 in `./.eslintrc.cjs`, then run `npm run lint` script in the terminal

### 2. 🤝 Credit

- <a href="https://www.flaticon.com/free-icons/dumbell" title="Dumbell icons">Dumbell icons created by Vitaly Gorbachev - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/random" title="random icons">Random icons created by noomtah - Flaticon</a>
- Photo by <a href="https://unsplash.com/@weareambitious?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ambitious Creative Co. - Rick Barrett</a> on <a href="https://unsplash.com/photos/AcFdytAyJgk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
- Photo by Cliff Booth on [Pexels](https://www.pexels.com/photo/photo-of-women-stretching-together-4056723/)
- Photo by Gustavo Fring from [Pexels](https://www.pexels.com/photo/women-keeping-fit-3984353/)
- Photo by Andrej Klintsy on [Pexels](https://www.pexels.com/photo/a-woman-doing-sit-ups-6392828/)
- Photo by Leon Ardho from [Pexels](https://www.pexels.com/photo/man-and-woman-holding-battle-ropes-1552242/)
- Photo by <a href="https://unsplash.com/@sammoghadamkhamseh?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sam Moghadam Khamseh</a> on <a href="https://unsplash.com/photos/W8CyjblrF8U?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
- Photo by <a href="https://unsplash.com/@markadriane?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">MARK ADRIANE</a> on <a href="https://unsplash.com/photos/FH6JcaCrYJ0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
- Photo by Yan Krukau from [Pexels](https://www.pexels.com/photo/people-doing-raised-hands-pose-in-yoga-class-8436587/)

<!--
### 3. 🔁 Changelogs

These changelogs are created as quick references. In real development and production, changelogs will be managed within GitHub releases and/or Wiki.

#### V0

#### V1

This version is created because the previous version is stuck on the coding of model .js files, since using plain SQL to write complex queries is rather cumbersome to solve the issue raised by the complexity of the database design/modeling (too many many-to-many relationships).

This version will focus on the integration of ORM.

-   Adopt Sequelize as the ORM tool, subsequently leads to the change of data modeling
-   Provide an alternative solution by using npm scripts to automate the creation and population of tables in an existing [MySQL schema/database](https://stackoverflow.com/questions/11618277/difference-between-schema-database-in-mysql) with the same name as the database string specified in `./src/data/pool.js`, this approach is inspired by the [seeding in Prisma](https://www.prisma.io/docs/guides/database/seed-database).

#### V2

This version is created because of an issue encountered during the integration of [`sequelize-auto`](https://github.com/sequelize/sequelize-auto) and [basing the .prettierignore on .gitignore and .eslintignore](https://prettier.io/docs/en/install.html), the later calls for [these solutions](https://stackoverflow.com/questions/65635648/how-to-base-prettierignore-file-on-gitignore). After ruling out the possibility of incorrectly specifying the path, the issue is potentially caused by [the use of proxy server](https://techcommunity.microsoft.com/t5/windows-powershell/the-term-is-not-recognized-as-the-name-of-a-cmdlet/m-p/1414518) when using `parcel` and `webpack`. More importantly, the server start time is faster and the project file/folder structure scaffolded by Vite is more close to the one used in Next.js, which will help the developer to smooth out the transition to Next.js in the future.

This version will focus on the integration of ORM & debugging resolver.

-   Adopt Vite as the [bundler](https://beta.reactjs.org/learn/start-a-new-react-project), subsequently leads to [the restructuring of files/folders](https://blog.webdevsimplified.com/2022-07/react-folder-structure/)
-   Adopt ESLint, configured with reference to Prettier and Git, to enforce linting rules
-   Remodel the database: (1) remove the `Gyms` table and the `Users` table, (2) add the `Logins` table

#### V3

-   Ditch ORM due to too much efforts, requiring extra code to configure associations and enable helper functions and extra work of refactoring
-   Refactor code by using `try...catch` and `async/awaits
-   Adopt a better way to import `fs` and `path` modules
-   Reintroduce proxy, by configuring Vite
-   Adopt Express JSON Validator Middleware to validate and handle errors
-   Adopt dotenv to manage environment variables
-   Remodel the database: (1) use the `Sessions` table to store common info shared among diff activities, namely `duration` & `price`, (3) delete `roomNumber` and relocate `trainerId` & `dateTime` to `Bookings`, (3) keep the functionality of `Sessions` table but rename to `Classes`
-->
