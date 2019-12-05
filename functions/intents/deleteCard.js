/* eslint-disable promise/always-return */
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');
const axios = require('axios');


const deleteCard = async (conv, params) => {
    console.log("delete");
    let taskToDelete = params.taskName;
    console.log(params);
    return axios.delete("http://localhost:5000/api/cards/delete", {
        data:
            {
                "cardId": taskToDelete
            }
    }).then((res) => {
        conv.ask("Card named " + taskToDelete + " has been removed");
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

    }).catch((e) => {
        conv.ask("error");
    })

};

module.exports = deleteCard;
