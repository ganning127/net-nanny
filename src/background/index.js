import { runtime } from 'webextension-polyfill';

runtime.onInstalled.addListener(() => {
    console.log('[background] loaded ');
});

runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text == "tab_id") {
        sendResponse({ tab: sender.tab.id });
    }
});

export { };