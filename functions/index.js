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
            "columnId": "1",
            "cardId": taskName

        },
        {
            "Accept": "application/json",
            "Content-type": "application/json"
        }).then((res) => {
        conv.ask("new task created named: " + params.taskName)
    })

});

app.intent('deleteCard', (conv, params) => {
    let taskToDekete = params.taskName;
    console.log(params);
    conv.ask("Removing task named " + params.taskName)

});
app.intent('moveCard', (conv, params) => {
    let taskToDekete = params.taskName;
    let toColumn = params.columnNameTo;
    console.log(params);
    conv.ask("Moving task named " + params.taskName + " to column: " + toColumn)

});


// exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

express().use(bodyParser.json(), app).listen(process.env.PORT || 8080);
