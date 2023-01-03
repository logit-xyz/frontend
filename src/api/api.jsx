import toast from "react-hot-toast"
import { validLink } from "./regex"

const DEBUG = true 
const apiUrl = DEBUG ? "http://localhost:8080" : "https://logit.onrender.com" 

function upload_img(file) {
    // Create a new FormData object
    var formData = new FormData();
    // Add the image file to the FormData object
    formData.append('image', file, file.name);

    return fetch(`${apiUrl}/upload`, { 
        method: "post",
        body: formData,
    })
}

function build(list_str) {
    const ingList = list_str.split('\n') 
    const data = {
        list: ingList
    }

    return fetch(`${apiUrl}/build`, { 
        method: "post",
        body: JSON.stringify(data),
    })
}

// log in
function login() {
    console.log("running login code")
    fetch(`${apiUrl}/auth`)
        .then(res => res.json())
        .then(res_json => {
            if (res_json.status === 200 && res_json.data) {
                window.location.replace(res_json.data.redirect_uri)
            }
        })
}

function set_session(code) {
    return fetch(`${apiUrl}/set_session`, {
        method: "post",
        body: JSON.stringify({code: code})
    })
}

// logs you out
// session object -> { sessonId, user }
function logout(session, callback) {
    const token = (!session) ? "" : session.sessionId
    // remove the session
    fetch(`${apiUrl}/logout`, {
        method: "post",
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                // only remove the token if the logout was successful
                window.localStorage.removeItem("session")
                callback(null)
            }
        })
}

// gets the current active session user
async function get_current_user(session) {
    console.log("session", session)
    const token = (!session) ? "" : session.sessionId
    return fetch(`${apiUrl}/me`, {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })
}

function calculate(link, onSuccess, onError) {
    const regex = new RegExp(validLink);
    if (link === "" || link === null || link === undefined || !regex.test(link)) {
        toast.error(
            "enter a valid link", {
            className: "dark:bg-neutral-800 dark:text-neutral-50"
        })
        // premature return
        return;
    }

    fetch(`${apiUrl}/calculate?link=${link}`)
        .then(res => {
            if (res.status === 202) {
                return res.json()
            } else {
                return null
            }
        })
        .then((data) => {
            if (data === null || data.nutrition == null) {
                onError()
            } else {
                onSuccess(data)
            }
        })
}

function create_food(session, recipe) {
    var createBody = {
        foodName: recipe.name,
        servingSize: 1,
        unitId: 304,
        nutrition: {}
    }
    var nutritionPost = {}
    var keys = Object.keys(recipe.nutrition)
    for (var i = 0; i < keys.length; ++i) {
        nutritionPost[keys[i]] = recipe.nutrition[keys[i]].qty
    }
    createBody.nutrition = nutritionPost
    return fetch(`${apiUrl}/create`, {
        method: "POST",
        headers: {
            'Authorization': session.sessionId
        },
        body: JSON.stringify(createBody)
    })
        
}

function add_log(session, recipe, meal) {
    var logBody = {
        foodName: recipe.name,
        mealTypeId: meal.id,
        amount: 1,
        unitId: 304,
        nutrition: {}
    }
    var nutritionPost = {}
    var keys = Object.keys(recipe.nutrition)
    for (var i = 0; i < keys.length; ++i) {
        nutritionPost[keys[i]] = recipe.nutrition[keys[i]].qty
    }
    logBody.nutrition = nutritionPost
    fetch(`${apiUrl}/log`, {
        method: "POST",
        headers: {
            'Authorization': session.sessionId
        },
        body: JSON.stringify(logBody)
    })
        .then((res) => {
            if (res.status === 201) {
                toast.success('added to log', {
                    className: "dark:bg-neutral-800 dark:text-neutral-50"
                })
            } else {
                toast.error("couldn't add to log", {
                    className: "dark:bg-neutral-800 dark:text-neutral-50"
                })
            }
        })
}

export {
    login,
    logout,
    set_session,
    get_current_user,
    calculate,
    add_log,
    create_food,
    upload_img,
    build,
}
