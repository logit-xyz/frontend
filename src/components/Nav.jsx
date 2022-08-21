import React from 'react'
import { login, logout } from '../api/api'
import { useSession } from '../hooks/useSession'
import Logo from './Logo'
import Switcher from './Switcher'

function Nav({ user }) {
    const [session] = useSession()

    return (
        <div className="bg-white border-b-[1.25px] border-slate-200 dark:bg-neutral-900 dark:border-zinc-800 flex flex-row justify-between items-center px-2 md:px-4 lg:px-6">
            <Logo />
            <div className='flex flex-row items-center space-x-4 md:space-x-8'>
                {!user && <button
                    onClick={login}
                    className={`text-sm lg:text-base text-neutral-800 
                        hover:text-neutral-600 dark:text-neutral-100 
                        dark:hover:text-neutral-50`}>
                    Sign In
                </button>}
                {user && <button
                    onClick={() => logout(session)}
                    className={`text-sm lg:text-base text-neutral-800 
                        hover:text-neutral-600 dark:text-neutral-100 
                        dark:hover:text-neutral-50`}>
                    Log out
                </button>}
                <Switcher
                    className={`h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 dark:text-neutral-200 text-neutral-800 
                hover:cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-50`} />
                {user && <div className='h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8'>
                    <img 
                        className="object-cover rounded-full border-[1px] border-slate-300 dark:border-0" 
                        src={user.avatar640} />
                </div>}
            </div>
        </div>
    )
}

export default Nav