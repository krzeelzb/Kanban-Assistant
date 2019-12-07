/* eslint-disable promise/always-return */

const {List, Image} = require('actions-on-google');


const axios = require('axios');
token = "";
const welcome = async (conv) => {

    await axios.post("http://localhost:5000/api/users/login", {
        "email": "el@g.com",
        "password": "123"
    }).then((res) => {
        token = res.data.token;

    }).catch((e) => {
        console.log(e);
        conv.ask("error");
    });


    conv.ask('Welcome to Kanban Assistant. I can help you organise your Kanban board.');
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
};


module.exports = welcome;
