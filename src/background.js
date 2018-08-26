chrome.contextMenus.create({
    title: 'Copy Full XPath',
    type: 'normal',
    contexts: ['all'],
    onclick: copyFullXPath
});

function copyFullXPath(info, tab) {
    chrome.tabs.sendMessage(tab.id, 'GET_CLICKED_ELEMENT', function(data) {
    });
}