require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const axios = require('axios');
const moment = require('moment');
const { decode } = require('punycode');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// route for home page - placeholder for now
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// route for user registration
app.post('/register', async(req, res) => {
  const { username, email, password } = req.body;

  // create new user
  try{
    if(!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // set salt rounds
    const salt = 10;
    // hashing the password - cybersecurity type shit
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', 
      [username, email, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// route for user login
app.post('/login', async(req, res) => {
  // login will require email and password
  const { email, password } = req.body;
  
  try {
    // sql query
    // console.log('line49'); // debugging
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )
    // console.log('line 53 length: ', userCheck.rows.length); // debugging
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: 'invalid email index line 47' });
    }
    // console.log('line56');
    const user = userCheck.rows[0];
    // console.log('Retrieved user:', user); // debugging

    // check password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'invalid email or password index line 54'});
    }

    // jwt stuff
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {expiresIn: '1h'})

    res.json({ token });

  } catch (err) {
    console.error('Error in login route: ', err);
    res.status(500).json({ error: err.message });
  }
});

// route to show logged in user's details
app.get('/profile', async(req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) {
    return res.status(401).json({ error: 'no token provided'});
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;
    console.log(id);
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if( user.rows.length === 0) {
      res.status(404).json({ error: 'User not found '});
    }
    res.json(user.rows[0]);
  } catch(err) {
    console.error('Error retrieving profile: ', err);
    res.status(500).json({ error: err.message });
  }
});

// experiment with middleware - please work
const authMiddleware = (req, res, next) => {
  // get second part of header value - form is Bearer <token>
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) {
    return res.status(401).json({ error: 'No token provided'});
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // make this data available for the next middleware(s)
    req.user = decodedToken;
    next();
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};

// req and res should be used by the function above
app.get('/protected-route', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});


// need CRUD functionality for events
// event table has id, title, description, date, location, created_by, created_at, start_time, end_time
// route for creating events
app.post('/events/new', async(req, res) => {
  // id, created by, and created at shouldn't be required params
  const { title, description, location, start_time, end_time, date } = req.body;
  
  // the token is unique depending on the user that's logged in
  const token = req.header('Authorization')?.split(' ')[1];
  // no token means not logged in, can't create events if not logged in
  if(!token) {
    return res.status(401).json({ error: 'No token provided'});
  }

  try {
    // decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const createdBy = decodedToken.id; //extract id

    const newEvent = await pool.query(
      'INSERT INTO events (title, description, location, created_by, start_time, end_time, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, location, createdBy, start_time, end_time, date]
    );
    res.status(201).json(newEvent.rows[0]);
  } catch(err) {
    console.error("Error creating event: ", err);
    res.status(401).json({ error: err.message });
  }
});

// route for reading a list of events
app.get('/events', async(req, res) => {
  // sort list by date
  try {
    const eventList = await pool.query('SELECT * FROM events ORDER BY date');
    res.status(200).json(eventList.rows);
  } catch(err) {
    console.error("Error retrieving events: ", err);
    res.status(500).json({ error: err.message });
  }
});

// route for retrieving an event by its id
app.get('/events/:id', async(req, res) => {
  const { id } = req.params;
  try {
    const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if(event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event.rows[0])
  } catch(err) {
    console.error("Error retrieving event: ", err);
    res.status(500).json({ error: err.message });
  }
});

// // route for retrieving an event by date
// app.get('/events/:date', async(req, res) => {
//   const { date } = req.params;
//   try {
//     const event = await pool.query('SELECT * FROM events WHERE date = $1', [date]);

//     if(event.rows.length === 0) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.status(200).json(event.rows[0])
//   } catch(err) {
//     console.error("Error retrieving event: ", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// route for updating an event
app.put('/events/:id', async(req, res) => {
  const { id } = req.params;
  const { title, description, date, location, start_time, end_time } = req.body;
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) {
    return res.status(401).json({ error: 'No token provided'});
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const createdBy = decodedToken.id;
    const updatedEvent = await pool.query(
      'UPDATE events SET title = $1, description = $2, location = $3, created_by = $4, start_time = $5, end_time = $6, date = $7 WHERE id = $8 RETURNING *',
      [title, description, location, createdBy, start_time, end_time, date, id]
    );
    if (updatedEvent.rows.length === 0){
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(updatedEvent.rows[0]);
  } catch(err) {
    console.error("Error updating event: ", err);
    res.status(500).json({ error: err.message });
  }
});

// route for deleting events
app.delete('/events/:id', async(req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deletedEvent = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if(deletedEvent.rows.length === 0){
      console.log('Event not found: ', id)
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log('Deleted event: ', deletedEvent.rows[0]);
    res.status(204).send();
  } catch(err) {
    console.error("Error deleting event: ", err);
    res.status(500).json({ error: err.message });
  }
});

// API integration - need to get weather details for the date of event at the location
// need the location's coordinates for the API calls' parameters 
async function getCoordinates(location) {

  try{
    const api_url = 'https://api.opencagedata.com/geocode/v1/json';
    const request_url = `${api_url}?q=${location}&key=${process.env.OPENCAGE_GEOCODING_API_KEY}`;
    const response = await axios.get(request_url);

    if(response.data.results.length === 0){
      console.log('Location not found line 215');
      throw new Error("Location not found");
    }

    const {lat, lng} = response.data.results[0].geometry;

    return { latitude: lat, longitude: lng };
  } catch(err) {
    console.error('Error fetching coordinates: ', err);
    throw new Error("Failed to fetch coordinates");
  }
};

// function to get forecast for the event
// free plan only allows access to 7 days of daily forecast
// ill make do with what i have
async function getWeatherForecast(date, location) {
  try{
    const {latitude, longitude} = await getCoordinates(location);
    console.log(`Coordinates: (${latitude}, ${longitude})`);

    // logic for hourly forecasts - not applicable

    // // round down the current hour
    // const current = moment().startOf('hour');

    // // // find start and end to get number of hours for forecast
    // // const eventStart = moment(`${date}${start_time}`, 'YYYY-MM-DD HH:mm:ss');
    // // const eventEnd = moment(`${date}${end_time}`, 'YYYY-MM-DD HH:mm:ss');
    // // console.log(eventStart.toString());
    // // console.log(eventEnd.toString());

    // const numHours = eventEnd.diff(current, 'hour');
    // console.log(`numHours = ${numHours}`);

    // if(numHours > 240) {
    //   console.error('Forecast can only be for within 10 days');
    //   return [];
    // }

    // 7 allowed in free version of Weatherbit
    const numDays = 7;
    
    const api_url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const request_url = `${api_url}?key=${process.env.WEATHERBIT_API_KEY}&lat=${latitude}&lon=${longitude}&days=${numDays}`;

    const response = await axios.get(request_url);
    const forecasts = response.data.data;

    const requiredForecast = forecasts.find( forecast => 
      moment(forecast.datetime).isSame(date, 'day')
    )

    if(!requiredForecast) {
      console.log("No forecast available for this date.");
      return {};
    }
    return requiredForecast;
  } catch(err) {
    console.error('Error fetching forecast: ', err);
    throw new Error('Failed to fetch forecast')
  }
};

// route for getting forecast for an event
app.get('/events/:id/weather', async(req, res) => {
  const { id } = req.params;

  try{
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if(eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const event = eventResult.rows[0];

    const forecasts = await getWeatherForecast(event.date, event.location);
    res.status(200).json(forecasts);
  } catch(err) {
    console.error("Error fetching forecasts: ", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
