# High Street Gym

A gym website project created for schoolwork.

## 🛠️ Usage

**Step 1**: To run this web app in local environment, clone the repository and install dependencies:

```bash
git clone https://github.com/mg86837242/high-street-gym-v4-api.git

cd high-street-gym-v4-api

npm install
```

**Step 2**: Open MySQL Workbench to import dataset. Steps for using the MySQL Workbench tool:

    1.  Administration – data import/restore
    2.  Import from self-contained file
    3.  Select the dump file located at `./high-street-gym-v3/api/var`
    4.  Start import

Configure `mysql2` [options](https://github.com/sidorares/node-mysql2#using-connection-pools) in `./pool.js`.

**Step 3**: Then start the API server (backend):

```bash
npm start
```

**Step 4**: Then start the API server (backend):

```bash
npm start
```

Navigate to [`http://localhost:5173`](http://localhost:5173).

<!--
The following items are changed for deployment:
- `.env` file, which affects `VITE_PORT` in `config/constants.js`
- `config/middlewareConfig` CORS setting
-->
