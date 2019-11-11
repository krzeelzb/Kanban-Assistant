/* eslint-disable promise/always-return */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {
    dialogflow, Suggestions, Table, List, Image, BrowseCarouselItem, BrowseCarousel
} = require('actions-on-google');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const app = dialogflow({debug: false});
const axios = require('axios');


app.intent('Default Welcome Intent', (conv) => {
    conv.ask('Welcome to Kanban Board Assistant');
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        return;
    }
    conv.ask(new List({
        items: {
            'BOARD': {
                synonyms: [
                    'Show me my board',
                    'Tell me my Kanban Board',
                    'Show me my Kanban Board',
                                   ],
                title: 'Show Kanban Board',
                description: 'See how your Kanban Board looks like',
                image: new Image({
                    url: 'https://image.flaticon.com/icons/png/512/2018/2018793.png',
                    alt: 'populacja',
                }),
            },
            'createNewCard': {
                synonyms: [
                    'Add new task',
                    'Make a new card',
                    'Create a new card named',
                ],
                title: 'New Card',
                description: 'Add new cards to ypur To Do list',
                image: new Image({
                    url: "https://image.flaticon.com/icons/png/512/109/109691.png",
                    alt: 'add',
                }),
            },
            'deleteCard': {
                synonyms: [
                    'Remove card',
                    'Delete card',
                    'Delete card named..',
                ],
                title: 'Remove Card',
                description: 'Remove cards from Kanban Board',
                image: new Image({
                    url: 'https://image.flaticon.com/icons/png/512/61/61655.png',
                    alt: 'delete',
                }),
            },
            'moveCard': {
                synonyms: [
                    'Move card',
                    'Move card from',
                    'Please move card named..',
                ],
                title: 'Move Card',
                description: 'Move card to diffrent list',
                image: new Image({
                    url: 'https://image.flaticon.com/icons/png/512/64/64787.png',
                    alt: 'move',
                }),
            },
        },
    }));
});

const SELECTED_ITEM_CONTEXTS = {
    'BOARD': 'board',
    'createNewCard': 'createnewcard',
    'deleteCard': 'deleteCard',
    'moveCard': 'moveCard',
};

const SELECTED_ITEM_RESPONSES = {
    'BOARD': 'Type or say one of the following',
    'createNewCard': 'Type or say one of the following',
    'deleteCard': 'Type or say one of the following',
    'moveCard': 'Type or say one of the following',
};

const SELECTED_ITEM_SUGGESTIONS = {
    'BOARD': ['Show me my Board', 'Tell me my Board'],
    'createNewCard': ['Create new card', 'New thing to do'],
    'deleteCard': ['Remove card', 'Delete card','Delete card named...'],
    'moveCard': ['Move card', 'Move card from', 'Please move card named..'],
};

app.intent('actions.intent.OPTION', (conv, params, option) => {
    if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
        conv.contexts.set(SELECTED_ITEM_CONTEXTS[option], 2);
    }
    conv.ask(`${SELECTED_ITEM_RESPONSES[option]}`);
    conv.ask(new Suggestions(SELECTED_ITEM_SUGGESTIONS[option]));

});
app.intent('createNewCard', async (conv, params) => {

        console.log("I AM HEERE")
        let taskName = params.taskName;
        console.log(params);

        return await axios.post("http://localhost:5000/api/cards", {
                "title": taskName,
                "columnId": "column_todo",
                "cardId": taskName
            },
            {
                "Accept": "application/json",
                "Content-type": "application/json"
            }).then((res) => {
            conv.ask("new task created named: " + params.taskName)
        })
});

app.intent('deleteCard', async (conv, params) => {
    console.log("delete")
    let taskToDelete = params.taskName;
    console.log(params);
    return axios.delete("http://localhost:5000/api/cards/delete", {
        data:
            {
                "cardId": taskToDelete
            }
    }).then((res) => {
        conv.ask("Removing task named " + taskToDelete)
    }).catch((e) => {
        conv.ask("error");
    })
});

app.intent('moveCard', async (conv, params) => {
    console.log("move")
    let taskToMove = params.taskName;
    let toColumn = params.columnNameTo;
    let fromColumn = params.columnNameFrom;
    console.log(params);
    return await axios.post("http://localhost:5000/api/cards/moveCard", {
        "originColumnId": fromColumn,
        "destColumnId": toColumn,
        "cardId": taskToMove
    }).then(async (res) => {

        conv.ask("Moving task named " + params.taskName + " to column: " + toColumn)
    }).catch((e) => {
        conv.ask("error");
    })

});

//TODO: ładniejsza lista zadan do wykoniania
app.intent('getCardsFromColumn', async (conv, params) => {
    console.log("cardsform column")
    let fromColumn = params.columnName;
    console.log(params);
    return await axios.post("http://localhost:5000/api/columns/fetchColumnById", {
        "columnId": fromColumn,
    }).then((res) => {
        const cardIds = res.data.columns[0].cardIds;
        console.log(cardIds);
        // console.log(columns.[])
        conv.ask("You have the following cards in " + fromColumn + " list: " + cardIds);
    }).catch((e) => {
        console.log(e);
        conv.ask("error");
    })
});

app.intent('board', async (conv, params) => {
        console.log("board")
        return await axios.get("http://localhost:5000/api/columns/all")
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
            }).catch((e) => {
                console.log(e);
                conv.ask("error");
            })
});

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

//TODO: welcome intent z listą rzeczy które można zrobić
// exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

express().use(bodyParser.json(), app).listen(process.env.PORT || 8080);
