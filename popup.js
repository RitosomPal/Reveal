let dom_chk = document.querySelectorAll('input[type=checkbox]')
let dom_hidden = document.getElementById('chk-hidden')
let dom_password = document.getElementById('chk-password')

function get_stat() {
    chrome.runtime.sendMessage({
        message: "get_stat"
    }, response => {
        if(response.message === 'success') {
            dom_hidden.checked = response.payload.hidden
            dom_password.checked = response.payload.password
        }
    })
}

get_stat()

dom_chk.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        chrome.runtime.sendMessage({
            message: "update_stat",
            payload: {
                hidden: dom_hidden.checked,
                password: dom_password.checked
            }
        }, response => {
            if(response.message === 'failed') {
                get_stat()
            }
        })
    })
})