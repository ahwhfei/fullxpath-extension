(function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)})([function(t,e){function n(t,e){chrome.tabs.sendMessage(e.id,"GET_CLICKED_ELEMENT",function(t){})}function o(t,e){chrome.tabs.sendMessage(e.id,"GET_CLICKED_ELEMENT_JSON",function(t){})}chrome.contextMenus.create({title:"Copy Full XPath",type:"normal",contexts:["all"],onclick:n}),chrome.contextMenus.create({title:"Copy JSON XPath",type:"normal",contexts:["all"],onclick:o})}]);