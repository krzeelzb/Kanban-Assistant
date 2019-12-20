/* eslint-disable promise/always-return */
const {
    Suggestions
} = require('actions-on-google');
const axios = require('../axios');

const cardsInColumn = async (conv, params) => {
    let fromColumn = params.columnName;
    return await axios.post("columns/column", {
        "columnId": fromColumn,
    }, {
        'headers': {'Authorization': token}
    }).then((res) => {
        const cardIds = res.data.columns[0].cardIds;
        console.log(cardIds);
        conv.ask("You have the following cards in " + fromColumn + " list: " + cardIds);
        conv.ask(new Suggestions('Show me my Board', 'Add a new Card', 'Delete Card', 'Move Card'))
    }).catch((e) => {
        console.log(e);
        conv.ask("Please try again.");
        conv.ask(new Suggestions('Show me my Board', 'Add a new Card', 'Delete Card', 'Move Card'))
    })
};

module.exports = cardsInColumn;
