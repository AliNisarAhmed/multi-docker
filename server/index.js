const keys = require('./keys')

// Express app setup

const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());

// Postgres client set up

const { Pool } = require('pg')

const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS values (number INT)`)
})().catch(err => console.log(err.stack))

// Redis client setup 

const redis = require('redis')

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate();

// Express Route handler

app.get('/', (req, res) => {
  res.send('Hi')
})

app.get('/values/all', async (req, res) => {
  const values = await pool.query(`SELECT * FROM values;`)
  console.log('All values on server: ', values.rows)
  return res.json(values.rows)
})

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    console.log('values on server: ', values)

    if (!values) return res.json(null);

    return res.json(values)

  })
})

app.post('/values', async (req, res) => {
  const { index: indexStr } = req.body;
  const index = Number(indexStr)

  if (Number.isNaN(Number(index)) || index > 40) {
    return res.status(400).send('Index must be a number less than 41')
  }

  redisClient.hset('values', index, 'Nothing yet!')
  redisPublisher.publish('insert', index);

  await pool.query(`INSERT INTO values(number) VALUES($1)`, [index])

  res.send({ working: true })
})

app.listen(5000, err => console.log('Listening on port: 5000'))
