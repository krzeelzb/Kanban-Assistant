/* eslint-disable promise/always-return */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {
    dialogflow, Permission,
    Suggestions, Table, List, Image, BrowseCarouselItem, BrowseCarousel
} = require('actions-on-google');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const app = dialogflow({debug: false});


const axios = require('axios');

app.intent('createNewCard', async (conv, params) => {
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

//TODO: naprawic zeby sie wyswietlało jak potrzeba, jak est wiecej w jakim zedzie to było wiece
app.intent('board', async (conv, params) => {
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
                rows:rows,
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
            // skip undefined values to preserve sparse array
            if (original[i][j] === undefined) continue;
            // create row if it doesn't exist yet
            if (copy[j] === undefined) copy[j] = [];
            // swap the x and y coords for the copy
            copy[j][i] = original[i][j];
        }
    }
    return copy;
}

//TODO: welcome intent z listą rzeczy które można zrobić
// exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

express().use(bodyParser.json(), app).listen(process.env.PORT || 8080);
