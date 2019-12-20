/* eslint-disable promise/always-return */
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');
const axios = require('../axios');

// const welcome = require('welcome');


const board = async (conv, params) => {
    console.log("board");
    return await axios.get("/columns/",
        {
            'headers': {'Authorization': token}
        })
        .then((res) => {
            const columns = res.data.columns;
            const titles = columns.map(item => item.title);
            const cards = columns.map(item => item.cardIds);
            const maxLength = Math.max(...cards.map(el => el.length));
            let rows = transpose(cards);
            for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < titles.length; j++) {
                    if (!(rows[i][j])) {
                        rows[i][j] = " ";
                    }
                }
            }
            conv.ask("Here is your board: ");
            conv.ask(new Table({
                dividers: true,
                columns: titles,
                rows: rows,
            }));
            conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

        }).catch((e) => {
            console.log(e);
            conv.ask("Please try again.");
            conv.ask(new Suggestions('Show me my Board', 'Add new Card', 'Delete Card', 'Move Card'))

        })
};

function transpose(original) {
    var copy = [];
    for (var i = 0; i < original.length; ++i) {
        for (var j = 0; j < original[i].length; ++j) {
            if (original[i][j] === undefined) continue;
            if (copy[j] === undefined) copy[j] = [];
            copy[j][i] = original[i][j];
        }
    }
    return copy;
}


module.exports = board;
