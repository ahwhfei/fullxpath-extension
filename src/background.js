chrome.contextMenus.create({
    title: 'Copy Full XPath',
    type: 'normal',
    contexts: ['all'],
    onclick: copyFullXPath
});

chrome.contextMenus.create({
    title: 'Copy JSON XPath',
    type: 'normal',
    contexts: ['all'],
    onclick: copyFullJSONXPath
});

function copyFullXPath(info, tab) {
    chrome.tabs.sendMessage(tab.id, 'GET_CLICKED_ELEMENT', function(data) {
    });
}

function copyFullJSONXPath(info, tab) {
    chrome.tabs.sendMessage(tab.id, 'GET_CLICKED_ELEMENT_JSON', function(data) {
    });
}