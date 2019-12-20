/* eslint-disable promise/always-return */
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');
const axios = require('../axios');


const cardsInColumn = async (conv, params) => {
    console.log("cardsform column");
    let fromColumn = params.columnName;
    console.log(params);
    return await axios.post("columns/column", {
        "columnId": fromColumn,
    }, {
        'headers': {'Authorization': token}
    }).then((res) => {
        const cardIds = res.data.columns[0].cardIds;
        console.log(cardIds);
        // console.log(columns.[])
        conv.ask("You have the following cards in " + fromColumn + " list: " + cardIds);
        conv.ask(new Suggestions('Show me my Board', 'Add a new Card', 'Delete Card', 'Move Card'))
    }).catch((e) => {
        console.log(e);
        conv.ask("Please try again.");
        conv.ask(new Suggestions('Show me my Board', 'Add a new Card', 'Delete Card', 'Move Card'))
    })
};


module.exports = cardsInColumn;
