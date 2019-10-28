const express = require('express');
const Card = require('../models/card');
const Column = require('../models/column');

const cardRouter = express.Router();

//new Card
cardRouter.post('/', async (req, res, next) => {
    try {
        const {title, columnId, cardId} = req.body;
        await Card.find().exec();
        const newCard = new Card({
            title,
            column: columnId,
            cardId,
        });
        const result = await newCard.save();
        const column = await Column.findOne({columnId}).exec();
        console.log(column)
        if (!column) {
            return res
                .status(404)
                .json({message: "Column of provided id doesn't exist"});
        }
        const newCardIds = Array.from(column.cardIds);
        newCardIds.push(result.cardId);
        column.set({cardIds: newCardIds});
        const result2 = await column.save();
        return res.status(201).json({
            message: 'new card is created and also cardIds in column is also updated',
            card: result,
            column: result2,
        });
    } catch (e) {
        console.log(e)
    }
});


module.exports = cardRouter;
