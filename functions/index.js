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
            // Add the first item to the list
            'BOARD': {
                synonyms: [
                    'Show me my board',
                    'Tell me my Kanban Board',
                    'Show me my Kanban Board',
                                   ],
                title: 'Show me my Kanban Board',
                description: 'See how your Kanban Board looks like',
                // image: new Image({
                //     url: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiRspG0pZHiAhWr-yoKHcdIA3QQjRx6BAgBEAU&url=https%3A%2F%2Fstat.gov.pl%2Fpodstawowe-dane%2F&psig=AOvVaw1tJjUu_Ts446LvvrbuYC_7&ust=1557589019220446',
                //     alt: 'populacja',
                // }),
            },
            'createNewCard': {
                synonyms: [
                    'Add new task',
                    'Make a new card',
                    'Create a new card named',
                ],
                title: 'New Card',
                description: 'Do you have anythings else new to add?',
                // image: new Image({
                //     url: 'https://www.flaticon.com/authors/freepik',
                //     alt: 'pracujący',
                // }),
            },
            // Add the third item to the list
            // 'WIEK': {
            //     synonyms: [
            //         'sprawdź wiek',
            //         'Powiedz mi coś o wieku ludzi',
            //         'Chcę dowiedzieć się czegoś o wieku',
            //         'Poprosiłbym o dane dotyczące wieku',
            //         'Dane o wieku',
            //         'Sprawdź dla mnie osoby w przedziale wiekowym'
            //
            //     ],
            //     title: 'Dane dotyczące wieku',
            //     description: 'Sprawdź liczbę osób w konkretym przedziale wiekowym w Twojej okolicy lub w wybranym przez Ciebie adresie',
            //     // image: new Image({
            //     //     url: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjhmtevqJHiAhUox4sKHcNJAEsQjRx6BAgBEAU&url=https%3A%2F%2Fwww.casecured.com%2Fhome%2F2018%2F2%2F9%2Fage-is-relative&psig=AOvVaw20EYAAeX5-8rC6rN3hwGAK&ust=1557589815375614',
            //     //     alt: 'wiek',
            //     // }),
            // },
        },
    }));
});

//TODO: make it work
const SELECTED_ITEM_CONTEXTS = {
    'BOARD': 'board',
    'createNewCard': 'createnewcard',

};

const SELECTED_ITEM_RESPONSES = {
    'BOARD': 'Here is your board',
    'createNewCard': 'What is it exactly?',
};

const SELECTED_ITEM_SUGGESTIONS = {
    'BOARD': ['ul. Piękna 8, Warszawa', 'Moja lokalizacja'],
    'createNewCard': ['Unit Testing', 'Peer tesing', 'Code review'],
};

app.intent('actions.intent.OPTION', (conv, params, option) => {
    if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {

        console.log("ooooooooooooooooooooooooooooo")
        console.log(option)
        console.log(conv.contexts);
        conv.contexts.set(SELECTED_ITEM_CONTEXTS[option], 2);
        console.log("ccccccccccccccccccccccccccccccc");
        console.log(conv.contexts);
    }
    conv.ask(`${SELECTED_ITEM_RESPONSES[option]}`);
    // conv.ask(new Suggestions(SELECTED_ITEM_SUGGESTIONS[option]));

});
app.intent('createNewCard', async (conv, params) => {

    console.log(conv.contexts)
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
    console.log(conv.contexts)
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
