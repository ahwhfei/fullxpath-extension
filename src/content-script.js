var eventMap = {
    a: {
        events: ["click"],
        attr: ["href"]
    },
    button: {
        events: ["click"],
        attr: ["value", "name"]
    },
    img: {
        events: ["click"],
        attr: ["src", "alt"]
    },
    select: {
        events: ["mouseup"],
        attr: ["name", "type", "selectedIndex"]
    },
    textarea: {
        events: ["mouseup"],
        attr: ["name"]
    },
    'input[type="submit"]': {
        events: ["click"],
        attr: ["name", "type", "value"]
    },
    'input[type="button"]': {
        events: ["click"],
        attr: ["name", "type", "value"]
    },
    'input[type="radio"]': {
        events: ["click"],
        attr: ["name", "type"]
    },
    'input[type="checkbox"]': {
        events: ["click"],
        attr: ["name", "type"]
    },
    'input[type="email"]': {
        events: ["click"],
        attr: ["name", "type"]
    },
    'input[type="search"]': {
        events: ["click"],
        attr: ["name", "type"]
    },
    'input[type="tel"]': {
        events: ["click"],
        attr: ["name", "type"]
    },
    'input[type="password"]': {
        events: ["click"],
        attr: ["name", "type"]
    },
    'input[type="text"]': {
        events: ["click"],
        attr: ["name", "type"]
    }
};

var nodeTypeEnum = {
    TEXT_ELEMENT: 3,
    ELEMENT_NODE: 1,
    DOCUMENT_NODE: 9,
    DOCUMENT_FRAGMENT_NODE: 11,
    CDATA_SECTION_NODE: 4
};

var isNodeTheRoot = function (node) {
    return 'BODY' === node.nodeName || null === node.parentNode;
};

var handleEmbeddedData = function (e) {
    return e && 0 === e.indexOf("data:") ? (debug("Embedded data provided in URI."),
        e.substring(0, e.indexOf(","))) : e + ""
};

var extractAttribute = function (e, t, n) {
    var i = e.nodeName.toLowerCase();
    if ("img" == i && "src" == t || "a" == i && "href" == t) {
        var r = e.getAttribute(t);
        return handleEmbeddedData(r)
    }
    var o;
    return o = e.getAttribute ? e.getAttribute(t) : e[t],
        n && typeof o != n ? null : o ? o : null
};

var extractElementContext = function (e) {
    var element = {};
    element.tag = e.nodeName,
        element.id = e.id ? '' + e.id : '',
        element.cls = e.className ? '' + e.className : '';

    var tag = element.tag.toLowerCase();
    'input' === tag && (tag += '[type="' + e.type + '"]');
    element.attrs = {};

    var setAttribute = function (attrName) {
        var attr = extractAttribute(e, attrName);
        attr && (element.attrs[attrName] = attr);
    };
    eventMap[tag] && eventMap[tag].attr.forEach(setAttribute);

    if (e.attributes) {
        for (var i = 0; i < e.attributes.length; i++) {
            e.attributes[i] && setAttribute(e.attributes[i].nodeName);
        }
    }

    if (e.parentNode && e.parentNode.childNodes) {
        var childNodes = e.parentNode.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] === e) {
                element.myIndex = i;
                break;
            }
        }

        var elementNodes = [];
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType === nodeTypeEnum.ELEMENT_NODE && childNodes[i].tagName === e.tagName) {
                elementNodes.push(childNodes[i]);
            }
        }

        element.siblingIndex = elementNodes.indexOf(e);
        element.siblings = elementNodes.length;
        element.child = e.childElementCount;
    }

    return element;
};

function isHighSurrogate(e) {
    return e >= 55296 && 56319 >= e;
}

function isLowSurrogate(e) {
    return e >= 56320 && 57343 >= e;
}

function trimSurrogate(e) {
    if (e.length < 1)
        return e;
    var t = e.slice(-1).charCodeAt(0);
    if (!isHighSurrogate(t) && !isLowSurrogate(t))
        return e;
    if (1 === e.length)
        return e.slice(0, -1);
    if (isHighSurrogate(t))
        return e.slice(0, -1);
    if (isLowSurrogate(t)) {
        var n = e.slice(-2).charCodeAt(0);
        if (!isHighSurrogate(n))
            return e.slice(0, -1)
    }
    return e
}

function getText(e, t) {
    var n, i = "", r = e.nodeType;
    if (r === nodeTypeEnum.TEXT_ELEMENT || r === nodeTypeEnum.CDATA_SECTION_NODE)
        return e.nodeValue;
    if ((r === nodeTypeEnum.ELEMENT_NODE || r === nodeTypeEnum.DOCUMENT_NODE || r === nodeTypeEnum.DOCUMENT_FRAGMENT_NODE))
        for (e = e.firstChild; e; e = e.nextSibling) {
            if (n = getText(e, t - i.length),
                (i + n).length >= t)
                return i + trimSurrogate(n.substring(0, t - i.length));
            i += n
        }
    return i
}

var extractElementTreeContext = function (e) {
    var t, n = {}, i = n, r = e;
    do {
        t = r;
        var o = extractElementContext(t);
        i.parentElem = o,
            i = o,
            r = t.parentNode
    } while (!isNodeTheRoot(t));

    var text = getText(e);
    text && (n.parentElem.text = text);
    n.parentElem.href = window.location.href;

    if ((e.nodeName.toLowerCase() + '["' + e.type + '"]') === 'input["text"]') {
        n.parentElem.value = e.value;
    }

    return n.parentElem;
};

var getTarget = function (event) {
    return event.target || event.srcElement;
};

var getValidTarget = function (node) {
    return node.nodeType === nodeTypeEnum.TEXT_ELEMENT
        ? node.parentNode
        : node.nodeType === nodeTypeEnum.CDATA_SECTION_NODE ? null : node.correspondingUseElement ? node.correspondingUseElement : node
};

var getPathWithPositionClassId = function (element) {
    let text = element.text ? ('[.="' + element.text + '"]') : '';

    if (element.id) {
        text = '[@id="' + element.id + '"]' + text;
    }

    if (element.cls) {
        text = '[@class="' + element.cls + '"]' + text;
    }

    if (element.siblings > 1) {
        text = '[' + (element.siblingIndex + 1) + ']' + text;
    }

    return '/' + element.tag.toLowerCase() + text;
};

var getFullPath = function (element) {
    let path = '';

    while (element) {
        path = getPathWithPositionClassId(element) + path;
        element = element.parentElem;
    }

    return path;
};

function copyToClipboard(text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
};

var clickedElementXPath;
document.addEventListener('mousedown', function (event) {
    //right click
    if (event.button == 2) {
        clickedEl = event.target;
        var node = getTarget(event);
        node = getValidTarget(node);
        var elementTree = extractElementTreeContext(node);

        clickedElementXPath = getFullPath(elementTree);
        console.log(clickedElementXPath);

    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(11111);
    if (request == 'GET_CLICKED_ELEMENT') {
        console.log(22222);
        setTimeout(() => {
            copyToClipboard(clickedElementXPath);
        }, 0);
        // sendResponse({ xpath: clickedElementXPath });
    }
});