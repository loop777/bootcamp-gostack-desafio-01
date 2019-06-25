const express = require('express');

const server = express();

server.use(express.json());

let numberReqs = 0;
let projects = [];

server.use((req, res, next) => {
numberReqs++;
  console.log(`Número de requisições: ${numberReqs}`);
  return next();
});

function checkProjectExists(req, res, next) {
    const {id} = req.params;
    const project = projects.find((val) => {
        return val.id === id;
    })
    if(!project) {
        return res.status(400).json({ error: "Project does not exists" });
    }

    return next();
}

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    projects.push({
        id, title, tasks: []
    });
    return res.json(projects);
})

server.get('/projects', (req, res) => {
    return res.json(projects);
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { title } = req.body;
    const {id} = req.params;
    projects = projects.map((val) => {
        if(val.id === id) {
            val.title = title;
        }
        return val;
    })
    return res.json(projects);
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const {id} = req.params;
    projects = projects.filter((val) => {
        return val.id !== id;
    })
    return res.json(projects);
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { title } = req.body;
    const {id} = req.params;
    projects = projects.map((val) => {
        if(val.id === id) {
            val.tasks.push(title);
        }
        return val;
    })
    return res.json(projects);
})

server.listen(3333);