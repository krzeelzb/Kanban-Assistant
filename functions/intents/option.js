
const {
    dialogflow, Suggestions, Table, List, Image
} = require('actions-on-google');



const option= (conv, params, option) => {
    if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
        conv.contexts.set(SELECTED_ITEM_CONTEXTS[option], 2);
    }
    conv.ask(`${SELECTED_ITEM_RESPONSES[option]}`);
    conv.ask(new Suggestions(SELECTED_ITEM_SUGGESTIONS[option]));

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

module.exports = option;
