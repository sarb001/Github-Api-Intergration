
import express from 'express';
import Github from './Routes/github.js' ;
const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/' ,Github);

app.listen(PORT, ()  => {
    console.log(`Server is working on ${PORT}..`);
})
