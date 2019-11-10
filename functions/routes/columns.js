const express = require('express');
const Column = require('../models/column');

const columnRouter = express.Router();

columnRouter.post('/', async (req, res, next) => {
    try {
        const { title, columnId } = req.body;
        await Column.find().exec();
        const newColumn = new Column({
            title,
            cardIds: [],
            columnId,
        });
        const result = await newColumn.save();
        return res.status(201).json();
    } catch (e) {
        return res.status(404).json()

    }
});

columnRouter.get('/all/',  async (req, res, next) => {
    try {
        const columns = await Column.find()
            .select('cardIds title columnId')
            .exec();
        console.log(columns)
        return res
            .status(200)
            .json({ message: 'success', columns: columns});
    } catch (e) {
        return res
            .status(404)
            .json({message: "error"});
    }
});

columnRouter.post('/fetchColumnById',  async (req, res, next) => {
    try {
        const {columnId} = req.body;
        console.log(columnId)
        const columns = await Column.find({columnId:columnId})
            .select('cardIds title columnId')
            .exec();
        console.log(columns)
        return res.status(200).json({columns:columns});
    } catch (e) {
        return res.status(404).json();
    }
});


module.exports = columnRouter;
