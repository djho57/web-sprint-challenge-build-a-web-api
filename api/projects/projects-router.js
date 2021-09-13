// Write your "projects" router here!
const express = require('express');
const router = require('express').Router();
const Project = require('./projects-model');

const {
    validateProjectId,
    validateProject,
} = require('../projects/projects-middleware');


// Returns and array of all projects
router.get('/', (req, res, next) => {
   Project.get()
    .then((projects) => {
        res.json(projects);
    })
    .catch(next);
});

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.projects);
});

router.post('/', validateProject, (req, res) => {
    Project.insert({ name: req.name, description: req.description })
        .then((newProject) => {
            res.status(201).json(newProject);
        })
        .catch(next);
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Project.update(req.params.id, { name: req.name, description: req.description })
        .then(() => {
            return Project.update(req.params.id);
        })
        .then((projects) => {
            res.json(projects);
        })
        .catch(next);
});

router.delete('/:id', validateProjectId, async (req, res) => {
    try {
        await Project.remove(req.params.id);
        res.json(req.projects);
    } catch (err) {
        next(err);
    }
});

router.get('/:id/actions', validateProjectId, async (req, res) => {
    try {
        const result = await Project.getProjectActions(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
