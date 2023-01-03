import React, { useEffect } from 'react'
import {  NavLink, useNavigate } from 'react-router-dom'
import { set_session } from '../api/api'

function AuthSuccess() {
    const navigate = useNavigate()        

    useEffect(() => {
        // Get the code
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        set_session(code)
            .then((res) => res.json()) 
            .then((json) => {
                if (json.status === 200) {
                    // only navigate once the session has been set  
                    console.log(json)
                    navigate("/", {
                        state: json.data
                    })
                }
            })
        // const timeout = setTimeout(() => {
        // }, 2000)
        //
        // return () => clearTimeout(timeout)
    })

    return (
        <div className='bg-white dark:bg-slate-900 h-full w-full flex flex-col items-center space-y-12'>
            <div className='flex flex-col items-center mt-10'>
                <img 
                    className='h-14 w-14 my-5 -rotate-[135deg]' 
                    src="/images/logo.png" 
                />
                <p className='text-3xl font-semibold mb-3'>Login Successful!</p> 
                <p className='text-xl text-slate-400 dark:text-slate-500'>
                    Redirecting you back to the application...
                </p> 
            </div>
            <p>
                If the application hasn't redirected you back in a couple of seconds
                click{' '}
                    <NavLink 
                        end 
                        className={'text-cyan-500 dark:text-cyan-600 hover:text-cyan-600 dark:hover:text-cyan-500 underline'} to={'/'}>
                        here 
                    </NavLink>
            </p>
        </div>
    )
}

export default AuthSuccess 
