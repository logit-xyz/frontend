import React, { useState } from 'react'

function RecipeLinkForm({ onSubmit }) {
    const [link, setLink] = useState("")

    function linkOnChange(e) {
        e.preventDefault()
        setLink(e.target.value)
    }

    return (
        <div className="dark:bg-neutral-800 bg-white flex flex-col md:flex-row items-center justify-around space-y-6 md:space-x-6 md:space-y-0 lg:space-x-10 lg:space-y-0 shadow-sm rounded-lg p-5">
            <input
                className={
                    `dark:bg-neutral-800 border-2 border-slate-200 
                    dark:border-zinc-700 rounded-md w-full lg:w-3/4 p-1 lg:p-3 
                    placeholder:text-neutral-400 dark:text-slate-50
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/70 dark:focus:ring-cyan-300/70`
                }
                placeholder="Recipe URL"
                onChange={linkOnChange}
                value={link}
                type={"text"} />
            {/* todo: make api requests at an app level  */}
            <button
                onClick={() => onSubmit(link)}
                className="w-1/2 lg:w-1/4 bg-cyan-600 hover:bg-cyan-700 p-2 lg:p-3 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-slate-50 hover:text-slate-50/80 text-sm lg:text-base font-medium rounded-lg">
                Calculate
            </button>
        </div>
    )
}

export default RecipeLinkForm