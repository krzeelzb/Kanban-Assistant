/* eslint-disable promise/always-return */
const {
    Suggestions
} = require('actions-on-google');
const axios = require('../axios');

const deleteCard = async (conv, params) => {
    let taskToDelete = params.taskName;
    return axios.delete("/cards/delete", {
        data:
            {
                "cardId": taskToDelete
            }
    }, {
        'headers': {'Authorization': token}
    }).then((res) => {
        conv.ask("Card named " + taskToDelete + " has been removed");
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

    }).catch((e) => {
        conv.ask("Please try again.");
        conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))
    })
};

module.exports = deleteCard;
