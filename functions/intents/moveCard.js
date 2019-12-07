/* eslint-disable promise/always-return */
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');

const axios = require('../axios');

const moveCard = async (conv, params) => {
    console.log("move");
    let taskToMove = params.taskName;
    let toColumn = params.columnNameTo;
    let fromColumn = params.columnNameFrom;
    console.log(params);
    return await axios.post("/cards/moveCard", {
        "originColumnId": fromColumn,
        "destColumnId": toColumn,
        "cardId": taskToMove
    }, {
        'headers': {'Authorization': token}
    }).then(async (res) => {

        conv.ask("Card named " + params.taskName + " moved to column: " + toColumn);
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

    }).catch((e) => {
        conv.ask("Please try again.");
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))
    })
};

module.exports = moveCard;
