"use strict";

let loaded = {};

chrome.runtime.onInstalled.addListener(function () {
    init_database();
});

chrome.commands.onCommand.addListener(function (command) {
    if (command === "show_emoji_selector") {

        // Get current tab ID
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            let tab = tabs[0];

            // Only load once per page
            if (!loaded[tab.id]) {
                chrome.tabs.insertCSS(tab.id, {file: 'emoji-selector/emoji-selector.css'});
                chrome.tabs.executeScript(tab.id, {file: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'});
                chrome.tabs.executeScript(tab.id, {file: 'emoji-selector/emoji-selector-util.js'});
                chrome.tabs.executeScript(tab.id, {file: 'emoji-selector/emoji-selector-elements.js'});
                chrome.tabs.executeScript(tab.id, {file: 'emoji-selector/emoji-selector.js'});

                loaded[tab.id] = true;

                send_message({id: "open_emoji_selector"});
            }

            // If this current tab changes at all (i.e. page change) we need to reload scripts
            chrome.tabs.onUpdated.addListener(function (tabId) {
                if (tabId === tab.id) {
                    console.log("Updated " + tab.id);
                    loaded[tabId] = false;
                }
            });
            return true;
        });
    }
});

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
    if (message.id === "db_get_first_emojis") {
        sendResponse(db_search_emojis(message.query));
    }
});

function send_message(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}