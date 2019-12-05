/* eslint-disable promise/always-return */
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');
const axios = require('axios');


const cardsInColumn = async (conv, params) => {
    console.log("cardsform column");
    let fromColumn = params.columnName;
    console.log(params);
    return await axios.post("http://localhost:5000/api/columns/fetchColumnById", {
        "columnId": fromColumn,
    }).then((res) => {
        const cardIds = res.data.columns[0].cardIds;
        console.log(cardIds);
        // console.log(columns.[])
        conv.ask("You have the following cards in " + fromColumn + " list: " + cardIds);
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))
    }).catch((e) => {
        console.log(e);
        conv.ask("error");
    })
};


module.exports = cardsInColumn;
