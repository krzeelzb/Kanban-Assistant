
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

module.exports = option;
