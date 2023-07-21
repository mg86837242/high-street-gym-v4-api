# High Street Gym

A gym web application (web app) created for schoolwork. This website is of dynamic nature, featuring database and API integration, interactive forms with proper validation, conditional rendering based on user roles and user inputs, content editing functionalities for authenticated users, etc.

For a fast preview of this web app, [deployment section](#2-deployment).

For more details about the project requirement, check the [project requirement section](#3-project-requirement).

## 1. Usage

**Step 1**: To run this web app in local environment, clone the backend repository to a folder of your choice (e.g. `my-folder`) and install dependencies:

```bash
git clone https://github.com/mg86837242/high-street-gym-v4-api.git

cd high-street-gym-v4-api

npm install
```

**Step 2**: Open MySQL Workbench to import dataset. Steps for using the MySQL Workbench tool:

    1.  Administration – data import/restore
    2.  Import from self-contained file
    3.  Select the dump file located at `./high-street-gym-v4-api/sqldump`
    4.  Start import

Configure `mysql2` [options](https://github.com/sidorares/node-mysql2#using-connection-pools) in `high-street-gym-v4-api/config/database.js`.

**Step 3**: Then start the API server (backend):

```bash
npm start
```

**Step 4**: Open up a new terminal in the same folder where the backend is located in order to clone the front repository:

```bash
cd ..

git clone https://github.com/mg86837242/high-street-gym-v4-client.git

```

Now the folder structure should look like this:

```
my-folder
├─ high-street-gym-v4-api
│  ├─ package.json
│  └─ ...
└─ high-street-gym-v4-client
   ├─ package.json
   └─ ...
```

Install dependencies and start the [Vite](https://vitejs.dev/guide/#command-line-interface) server (frontend):

```bash
cd high-street-gym-v4-client

npm run dev
```

Navigate to [`http://localhost:5173`](http://localhost:5173) in the browser to open the web app.

## 2. Deployment

For the deployed version of this web app, visit: http://54.91.168.210/

Technology used for deployment includes but not limited to:

- Amazon Web Services (AWS), including EC2 and RDS
- Linux (Ubuntu)
- Bash (Git Bash)
- Nginx – web server
- PM2 – backend process management
- Vite – frontend build tool

## 3. Project Requirement

The school project calls for a dynamic website with a database integration. In terms of the business requirement, the web app is expected to have the following functionalities:

- Handling user authentication
- Rendering a calendar view from information stored in the database, including booking date and time
- Functionality to allow users to book a class with a specific trainer
- Displaying users' blog with functionality to upload and read messages
- Utilization of at least two (2) XML documents to be used to send data to the database, in this case, for adding a new activity and adding a new member

The technology to be used for implementing this project is left to the discretion of the programmer/developer. The extensive list of packages used in the backend and the frontend can be found in their respective `package.json` file. Essential technology used for this project is listed below:

- Git – for version controlling (also used during deployment)
- Prettier & Eslint – for code formatting and quality
- Zod – for data validation
- Express.js – for API integration
- React – functional approach
- React Router 6.4+
- React Hook Form
- Tailwind CSS
- Tiptap – headless editor framework for blog functionalities

## 4. Credit

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
- Photo by Khaled Oukaci from [Pexels](https://www.pexels.com/photo/black-and-white-photo-of-a-backpacker-walking-in-the-desert-12563642/)
- Photo by <a href="https://unsplash.com/@d_mccullough?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Daniel McCullough</a> on <a href="https://unsplash.com/photos/-FPFq_trr2Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
- Photo by <a href="https://unsplash.com/@r3dmax?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jonatan Pie</a> on <a href="https://unsplash.com/photos/xgTMSz6kegE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
