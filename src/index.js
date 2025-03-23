import express from "express";
import mongoose from "mongoose";
import redis, { createClient } from 'redis';


const PORT = process.env.PORT || 4000;
const app = express();


// connect to Redis
const REDIS_PORT = 6379;
const REDIS_HOST = "redis";
const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis...'));
redisClient.connect();


// connect to Database
const DB_USER = "root";
const DB_PASSWORD = "example";
const DB_PORT = 27017;
const DB_HOST = "mongo";
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
mongoose
    .connect(URI)
    .then(() => console.log("Connected to db..."))
    .catch((err) => console.log("failed to conntect to db:", err));


app.get("/", (req, res) => {
    redisClient.set('products', 'products...');
    
    res.send("<h1> Hello<h1/>");
});

app.get("/data", async(req, res) => {
    const products = await redisClient.get('products');

    res.send(`<h1> Hello<h1/> <h2>${products}<h2/>`);
});


app.listen(PORT, () => console.log(`The app is running on Port ${PORT}`));
