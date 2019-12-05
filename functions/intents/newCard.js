const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');

const axios = require('axios');

const newCard = async (conv, params) => {
    console.log("create");
    const taskName = params.taskName;
    return await axios.post("http://localhost:5000/api/cards", {
            "title": taskName,
            "columnId": "To Do",
            "cardId": taskName
        },
        {
            "Accept": "application/json",
            "Content-type": "application/json"
        }).then((res) => {
        conv.ask("New task created named: " + params.taskName);
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

    })

};

module.exports = newCard;
