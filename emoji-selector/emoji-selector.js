"use strict";

chrome.runtime.onMessage.addListener(
    function (message, _sender, sendResponse) {

        if (message.id === "open_emoji_selector") {
            open_emoji_selector();
        }
        sendResponse();
    }
);

function open_emoji_selector() {
    let textbox = get_active_textbox();

    if (textbox) {
        create_emoji_selector(textbox);
    }
}

function get_active_textbox() {
    let activeElement = document.activeElement;

    if (activeElement && activeElement.type === "text") {
        return activeElement;
    }
}

function create_emoji_selector(textbox) {

    // Surrounding emoji-selector
    let emoji_selector = es_emoji_selector(textbox);
    document.body.appendChild(emoji_selector);

    // Focus the new textbox
    document.getElementById('emoji_search_box').focus();

}

// https://stackoverflow.com/questions/39871916/is-it-possible-to-generate-all-the-emojis-and-append-to-the-select-dropdown
// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply