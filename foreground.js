// let cn = 'reveal9999'

if (document.querySelectorAll('.reveal999h').length < 1) {
    document.querySelectorAll('input[type=hidden]').forEach(ele => {
        ele.classList.add("reveal999h");
    })
}
if (document.querySelectorAll('.reveal999p').length < 1) {
    document.querySelectorAll('input[type=password]').forEach(ele => {
        ele.classList.add("reveal999p");
    })
}

chrome.runtime.sendMessage({
    message: "get_stat"
}, response => {
    if(response.message === 'success') {
        let hType = (response.payload.hidden) ? 'text' : 'hidden'
        let pType = (response.payload.password) ? 'text' : 'password'

        document.querySelectorAll('.reveal999h').forEach(ele => {
            ele.type = hType
        })

        document.querySelectorAll('.reveal999p').forEach(ele => {
            ele.type = pType
        })
    }
})