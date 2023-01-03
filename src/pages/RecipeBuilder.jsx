import { CalculatorIcon, MinusSmallIcon, PlusCircleIcon, PlusSmallIcon, } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react'
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { upload_img, build } from '../api/api'
import AuthorizeAppDialog from "../components/AuthorizeAppDialog"

const key_mapping = {
    "calories": {
        "name": "Calories",
        "unit": "cal",
    },
    "sugarContent": {
        "name": "Sugar",
        "unit": "g"
    },
    "sodiumContent": {
        "name": "Sodium",
        "unit": "mg"
    },
    "fatContent": {
        "name": "Fat",
        "unit": "g"
    },
    "saturatedFatContent": {
        "name": "Saturated Fat",
        "unit": "g"
    },
    "transFatContent": {
        "name": "Trans fat",
        "unit": "g"
    },
    "carbohydratesContent": {
        "name": "Carbohydrates",
        "unit": "g"
    },
    "fiberContent": {
        "name": "Fiber",
        "unit": "g"
    },
    "proteinContent": {
        "name": "Protein",
        "unit": "g"
    },
    "cholesterolContent": {
        "name": "Cholesterol",
        "unit": "mg"
    },
}

function RecipeBuilder({ session, callback }) {
    const location = useLocation()
    const navigate = useNavigate()
    
    const [title, setTitle] = useState('')
    const [list, setList] = useState('')
    const [img, setImage] = useState(null)
    const [servingSize, setServingSize] = useState(1)

    const [nutrition, setNutrition] = useState(null)
    const [isAuthorizeDialogOpen, setIsAuthorizeDialogOpen] = useState(false)

    useEffect(() => {
        if (location.state) {
            get_current_user(location.state)
                .then(res => res.json())
                .then(json => {
                    if (json.status === 401) {
                        navigate("/builder", {
                            state: null
                        })
                        callback(null)
                    } else if (json.status === 200) {
                        callback(location.state) 
                    }
                }
            )
        }
    }, [session])
    
    function do_ocr() {
        if (img)  {
            upload_img(img)
                .then(res => res.json())
                .then(json => {
                    if (json.status === 200 && json.data) {
                        var parsedList = json.data.join('\n')
                        setList(parsedList)
                        toast.success(
                            "image import successful!", {
                                className: "dark:bg-slate-800 dark:text-slate-50"
                            }
                        )
                    } else {
                        toast.error(
                            "image import failed", {
                                className: "dark:bg-slate-800 dark:text-slate-50"
                            }
                        )
                    }
                })
        } else {
            toast.error(
                "no image to upload", {
                    className: "dark:bg-slate-800 dark:text-slate-50"
                }
            )
        }
    }
    
    function calculate() {
        if (list !== '') {
            build(list)
                .then(res => res.json())
                .then(json => {
                    if (json.status === 200 && json.data) {
                        toast.success(
                            "nutrients calculated!", {
                                className: "dark:bg-slate-800 dark:text-slate-50"
                            }
                        )
                        setNutrition(json.data.nutrition) 
                    } else {
                        toast.error(
                            "couldn't calculate nutrients", {
                                className: "dark:bg-slate-800 dark:text-slate-50"
                            }
                        )
                    }
                })
        } else {
            toast.error(
                "nothing to calculate", {
                    className: "dark:bg-slate-800 dark:text-slate-50"
                }
            )
        }
    };

    function onCreate() {
        if (session === null) {
            setIsAuthorizeDialogOpen(true)
        } else {
            console.log(title)
            const recipe = {
                foodName: title,
                unitID: 304,
                servingSize: servingSize,
                calories: nutrition['calories'],
                description: "",
                nutrition: nutrition
            }

            fetch("http://localhost:8080/create", {
                method: "POST",
                headers: {
                    'Authorization': session.sessionId
                },
                body: JSON.stringify(recipe)
            })
            .then((res) => {
                if (res.status === 201) {
                    toast.success("created food", {
                        className: "dark:bg-slate-800 dark:text-slate-50"
                    })
                } else {
                    toast.error("couldn't create food", {
                        className: "dark:bg-slate-800 dark:text-slate-50"
                    })
                }
            })
        }
    }

    return (
        <>
            <AuthorizeAppDialog open={isAuthorizeDialogOpen} onClose={() => setIsAuthorizeDialogOpen(false)} />
            <div className="flex flex-col w-[45%] justify-self-center space-y-10 my-10">
                <div className="dark:bg-slate-800 bg-white flex flex-col shadow-sm rounded-lg p-5">
                    {/* Input for text */}
                    <input 
                        type={'text'}
                        defaultValue={'Untitled Recipe'}
                        className={`dark:bg-slate-800 border-2 border-slate-200
                            dark:border-slate-700 rounded-md w-full lg:w-1/2 p-1 px-3 lg:p-3 
                            placeholder:text-slate-500 dark:text-slate-50
                            focus:outline-none focus:ring-2 focus:ring-cyan-500/70 dark:focus:ring-cyan-300/70
                            text-2xl font-semibold`}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className='flex flex-row mt-2 mb-5'>
                        <p className='font-medium mr-5 text-sm'>Serving Size:</p>
                        <div className='flex flex-row text-sm space-x-3'>
                            <PlusSmallIcon onClick={() => setServingSize(servingSize+1)} 
                                className='h-5 w-5 text-green-600 cursor-pointer dark:text-green-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full'/>
                            <p>{servingSize}</p>
                            <MinusSmallIcon onClick={() => setServingSize(servingSize-1)}
                                className='h-5 w-5 cursor-pointer text-rose-600 dark:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full'/>
                        </div>
                    </div>
                    
                    <div className='flex flex-col w-full'>
                        <p className='text-xl font-medium mb-3'>Ingredients</p>
                        {/* Input form for ingredients */}
                        <textarea
                            className={`dark:bg-slate-800 border-2 border-slate-200
                                dark:border-slate-700 rounded-md p-3 placeholder:text-slate-500
                                dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/70
                                dark:focus:ring-cyan-300/70
                            `}
                            placeholder='Write down your list of ingredients or import them from a picture!'
                            value={list}
                            onChange={(e) => setList(e.target.value)}
                        >
                        </textarea>

                        {/* Button to import from file also */}
                        <div className="flex flex-row space-x-5 my-4">
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" className={`block file:border-0
                                dark:bg-slate-700 bg-slate-100 rounded-md border-0
                                w-3/4 file:mr-4 file:p-2 file:bg-cyan-50 file:text-cyan-700
                                dark:file:hover:bg-cyan-600 file:hover:bg-cyan-100
                                file:cursor-pointer cursor-pointer 
                                dark:file:bg-cyan-500 dark:file:text-cyan-50
                            `}
                                accept={['jpg', 'jpeg', 'heic', 'png']}
                            />
                            <button onClick={do_ocr} className={`
                                bg-cyan-500 hover:bg-cyan-600 w-1/4 rounded-md dark:bg-transparent dark:border-2
                                dark:border-cyan-500 dark:hover:bg-cyan-700/30 text-cyan-50
                            `}>
                                Import 
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col mt-5 w-full'>
                        <p className="text-base md:text-lg lg:text-xl font-medium tracking-tight mb-2">
                            Nutrition Facts{' '}
                            <span className="text-slate-500 dark:text-slate-500 text-xs md:text-sm lg:text-base ml-1">(per serving)</span>
                        </p>
                        {list === '' && !nutrition && <div className='h-48 w-full'>
                            <div className='flex flex-col h-full justify-center items-center'>
                                <PlusCircleIcon className='h-12 w-12 dark:text-cyan-50 text-slate-600'/>
                                <p className='my-2 text-lg'>Add Ingredients</p> 
                                <p className='max-w-md text-base text-slate-500 text-center'>In order to get a detailed breakdown of your recipe, start
                                    adding some ingredients above!     
                                </p> 
                            </div>
                        </div>}
                        
                        {list !== '' && !nutrition && <div className='mt-8 w-full'>
                            <div className='flex flex-col h-full justify-center items-center'>
                                <CalculatorIcon className='h-12 w-12 dark:text-cyan-50 text-slate-600'/>
                                <p className='my-2 text-lg'>Calculate Nutrients</p>
                                <p className='max-w-md text-base text-slate-500 text-center'>
                                    When you're done adding your ingredients, calculate the nutrients in your recipe!
                                </p> 
                                <button onClick={calculate} className={`p-2 my-5
                                    bg-cyan-500 hover:bg-cyan-600 w-1/3 rounded-md
                                    dark:bg-cyan-600 dark:hover:bg-cyan-700/30 text-cyan-50
                                `}>
                                    Calculate 
                                </button>
                            </div>
                        </div>}

                        {nutrition && <div className='mt-2 w-full'>
                            {Object.entries(key_mapping).map(([key, value], index) => {
                                return (
                                    <div key={index} className="flex justify-between text-sm md:text-base lg:text-lg">
                                        <p className="text-semibold">{value.name}</p>
                                        <p className="text-slate-500 dark:text-slate-500">{Math.round(nutrition[key] * 100) / 100} {value.unit}</p>
                                    </div>
                                )
                            })}
                            <div className="flex flex-col md:flex-row space-x-8 text-base mt-8">
                                <button
                                    onClick={onCreate}
                                    className={`bg-cyan-600 hover:bg-cyan-700
                                    dark:bg-cyan-500 dark:hover:bg-cyan-600 w-full md:w-1/2 
                                    p-2 text-semibold text-slate-50 rounded-md 
                                    disabled:cursor-not-allowed 
                                    dark:disabled:hover:bg-cyan-500
                                    disabled:hover:bg-cyan-600`}>
                                    Create food
                                </button>
                                <button
                                    onClick={() => {setNutrition(null); setList('')}}
                                    className={`border-2 border-rose-600 hover:border-rose-700
                                hover:bg-rose-100/40 dark:hover:bg-rose-100/10 dark:border-rose-500 
                                    text-rose-700 dark:text-rose-500
                                    dark:hover:border-rose-600 w-full md:w-1/2 p-2 text-semibold rounded-md 
                                    disabled:cursor-not-allowed disabled:bg-rose-200/0
                                    disabled:border-rose-600 disabled:dark:bg-rose-100/0
                                    disabled:dark:border-rose-500`}>
                                    Clear
                                </button>
                            </div>

                        </div>}
                    </div>
                </div>
            </div>
        </>
    ) 
}


export default RecipeBuilder
