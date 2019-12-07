/* eslint-disable promise/always-return */
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');

const axios = require('../axios');

const newCard = async (conv, params) => {
    console.log("create");
    const taskName = params.taskName;
    return await axios.post("/cards", {
            "title": taskName,
            "columnId": "To Do",
            "cardId": taskName
        },
        {
            "Accept": "application/json",
            "Content-type": "application/json",
            'Authorization': token
        }).then((res) => {
        conv.ask("New task created named: " + params.taskName);
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

    }).catch((e) => {
        console.log(e);
        conv.ask("Please try again.");
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

    })
};


module.exports = newCard;
