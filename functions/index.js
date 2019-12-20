/* eslint-disable promise/always-return */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {dialogflow} = require('actions-on-google');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const app = dialogflow({debug: false});

const welcome = require("./intents/welcome");
const option = require("./intents/option");
const newCard = require("./intents/newCard");
const deleteCard = require("./intents/deleteCard");
const moveCard = require("./intents/moveCard");
const board = require("./intents/board");
const cardsFromColumn = require("./intents/cardsInColumn");


app.intent('Default Welcome Intent', welcome);
app.intent('actions.intent.OPTION', option);
app.intent('createNewCard', newCard);
app.intent('deleteCard', deleteCard);
app.intent('moveCard', moveCard);
app.intent('board', board);

//TODO: ładniejsza lista zadan do wykoniania
app.intent('getCardsFromColumn', cardsFromColumn);


// exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

express().use(bodyParser.json(), app).listen(process.env.PORT || 8080);
