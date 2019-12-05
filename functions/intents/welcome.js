
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');


const welcome = (conv) => {
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

const SELECTED_ITEM_CONTEXTS = {
    'BOARD': 'board',
    'createNewCard': 'createnewcard',
    'deleteCard': 'deleteCard',
    'moveCard': 'moveCard',
};

const SELECTED_ITEM_RESPONSES = {
    'BOARD': 'Type or say one of the following:',
    'createNewCard': 'Type or say one of the following:',
    'deleteCard': 'Type or say one of the following:',
    'moveCard': 'Type or say one of the following:',
};

const SELECTED_ITEM_SUGGESTIONS = {
    'BOARD': ['Show me my Board', 'Tell me my Board'],
    'createNewCard': ['Create new card', 'New thing to do'],
    'deleteCard': ['Remove card', 'Delete card','Delete card named...'],
    'moveCard': ['Move card', 'Move card from', 'Please move card named..'],
};



module.exports = welcome;
