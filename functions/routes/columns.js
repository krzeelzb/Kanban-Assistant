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
        // const board = await Board.findById(boardId).exec();
        // if (!board) {
        //     res.status(404).json({ message: 'No Board exists of provided id' });
        // }
        // const newColumnOrder = Array.from(board.columnOrder);
        // debugger;
        // newColumnOrder.push(result.columnId);
        // board.set({ columnOrder: newColumnOrder });
        // const result2 = await board.save();
        return res.status(201).json({
            message: 'New Column Added',
            column: result,
        });
    } catch (e) {
        return res
            .status(404)
            .json({message: "error"});

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

module.exports = columnRouter;
