import { useState, useEffect } from "react"
import { calculate, create_food, get_current_user } from "../api/api"
import { example } from "../api/exampleRecipe"
import RecipeCard from "../components/RecipeCard"
import RecipeLinkForm from "../components/RecipeLinkForm"
import { useSafeLocalStorage } from "../hooks/useSafeLocalStorage"
import toast from "react-hot-toast"
import AuthorizeAppDialog from "../components/AuthorizeAppDialog"
import ChooseMealDialog from "../components/ChooseMealDialog"
import { useLocation, useNavigate } from "react-router-dom"

function App({ session, callback }) {
    const location = useLocation()
    const navigate = useNavigate()
  const [recipe, setRecipe] = useSafeLocalStorage("recipe", example)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isAuthorizeDialogOpen, setIsAuthorizeDialogOpen] = useState(false)
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false)

    // read the sess query parameter
    // validate it by sending a backend request to me
    // change nav to say log out when user is not null
    // then also check if a recipe is sitting in local storage
    useEffect(() => {
        if (location.state) {
            get_current_user(location.state)
                .then(res => res.json())
                .then(json => {
                    if (json.status === 401) {
                        navigate("/", {
                            state: null
                        })
                        callback(null)
                    } else if (json.status === 200) {
                        callback(location.state) 
                    }
                })
        }
    }, [session])

  function onCalculate() {
    // use a javascript closure in order
    // to get around the fact that link's state
    // is contained within the child component
    return function (link) {
      setIsLoading(true)
      calculate(
        link,
        (data) => {
          toast.success(
            "nutrition facts calculated", {
            className: "dark:bg-slate-800 dark:text-slate-50"
          })
          setRecipe(data)
          setIsError(false)
        },
        () => {
          toast.error(
            "unable to calculate nutrition facts", {
            className: "dark:bg-slate-800 dark:text-slate-50"
          })
          setRecipe(example)
          setIsError(true)
        }
      )
      setIsLoading(false)
    }
  }

  function onLog() {
    if (session === null) {
      setIsAuthorizeDialogOpen(true)
    } else {
      setIsMealDialogOpen(true)
    }
  }

  function onCreate() {
    if (session === null) {
      setIsAuthorizeDialogOpen(true)
    } else {
      // make api call
      create_food(session, recipe)
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
      <ChooseMealDialog session={session} recipe={recipe} open={isMealDialogOpen} onClose={() => setIsMealDialogOpen(false)} />
      <div className="flex flex-col w-[85%] lg:w-[55%] justify-self-center space-y-10 my-10">
        <RecipeLinkForm onSubmit={onCalculate()} />
        <RecipeCard
          loading={isLoading}
          error={isError}
          data={recipe}
          onLog={onLog}
          onCreate={onCreate}
        />
      </div>
    </>
  )
}

export default App
