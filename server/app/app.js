import express from 'express';


export function createServerApplication() {

    const app = express();

    app.use(express.json());
    app.use("/uploads", express.static("uploads"));

    app.get('/', (req , res) => {
        res.send("hello")
    })

    return app
}

