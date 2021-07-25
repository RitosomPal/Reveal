chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        hidden: false,
        password: false
    })
})

chrome.tabs.onActivated.addListener(activeInfo => {
    setTimeout(() => {
        chrome.tabs.get(activeInfo.tabId)
        .then(data => data.url)
        .then(url => {
            if (/^http/.test(url)) {
                chrome.scripting.executeScript({
                    target: {tabId: activeInfo.tabId},
                    files: ["./foreground.js"]
                })
                .then(() => {
                    console.log("INJECTED FOREGROUNG SCRIPT.")
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err))
    }, 500);
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tabId, changeInfo, tab)
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["./foreground.js"]
        })
        .then(() => {
            console.log("INJECTED FOREGROUNG SCRIPT.")
        })
        .catch(err => console.error(err))
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_stat') {
        chrome.storage.local.get(['hidden', 'password'], data => {
            if (chrome.runtime.lastError) {
                sendResponse({message: 'failed'})
                return
            }
            sendResponse({
                message: 'success',
                payload: {
                    hidden: data.hidden,
                    password: data.password
                }
            })
        })
        return true
    } else if (request.message === 'update_stat') {
        chrome.storage.local.set({
            hidden: request.payload.hidden,
            password: request.payload.password
        }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({message: 'failed'})
                return
            }
            sendResponse({message: 'success'})
        })
        return true
    }
})