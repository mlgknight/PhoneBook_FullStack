const express = require("express");
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    {
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
];

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    const date = new Date();
    res.send(`Phone has info for ${persons.length} people <br><br>${date}`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const found = persons.some(person => person.id === req.params.id);

    if (!found) {
        res.status(400).json({ msg: `No person with id of ${req.params.id}` });
    } else {
        persons = persons.filter(person => person.id !== req.params.id); // Update the state
        res.json(persons);
    }
});



app.post("/api/persons/", (req, res) => {
    const id = uuidv4();
    const data = req.body;

    console.log('Received data:', data);

    if (!data.name || !data.number) {
        return res.status(400).json({ error: "Name or number missing" });
    }

    const personExists = persons.some(person => person.name === data.name && person.number === data.number);

    if (personExists) {
        return res.status(400).json({ error: "Person already in Database" });
    }

    const newPerson = { id, ...data };
    persons.push(newPerson);
    console.log('New person added:', newPerson); // Log new person
    res.json(newPerson);
});



app.listen(port, () => {
    console.log(`listening on ${port}`);
});
