import express from 'express';


export function createServerApplication() {

    const app = express();

    app.use(express.json());

    app.get('/', (req , res) => {
        res.send("hello")
    })

    return app
}

