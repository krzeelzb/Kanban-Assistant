/* eslint-disable promise/always-return */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {
    dialogflow,
    Permission,
    Suggestions,
    List, Image, BrowseCarouselItem, BrowseCarousel
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
            {"cardId": taskToDelete
    }}).then( (res) => {
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
        conv.ask("You have the following cards in "+ fromColumn+" list: "+cardIds);

    }).catch((e) => {
        console.log(e);
        conv.ask("error");
    })

});

// exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

express().use(bodyParser.json(), app).listen(process.env.PORT || 8080);
