import { useState, useEffect } from "react"
import { calculate, create_food, get_current_user } from "./api/api"
import { example } from "./api/exampleRecipe"
import RecipeCard from "./components/RecipeCard"
import Nav from "./components/Nav"
import RecipeLinkForm from "./components/RecipeLinkForm"
import { useSafeLocalStorage } from "./hooks/useSafeLocalStorage"
import { useSession } from "./hooks/useSession"
import toast, { Toaster } from "react-hot-toast"
import AuthorizeAppDialog from "./components/AuthorizeAppDialog"
import ChooseMealDialog from "./components/ChooseMealDialog"

function App() {
  const [session] = useSession()
  const [user, setUser] = useState(null)
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
    if (session != null) {
      // get the current user
      get_current_user(session)
        .then((res) => {
          if (res.status === 200) {
            return res.json()
          } else if (res.status === 401) {
            // if the current session stored is invalid, remove it
            window.localStorage.removeItem("sessionId")
          }
          
          // if none of the cases above fit, just return null
          return null
        })
        .then((data) => setUser(data))
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
            className: "dark:bg-neutral-800 dark:text-neutral-50"
          }
          )
          setRecipe(data)
          setIsError(false)
        },
        () => {
          // todo: send notification
          toast.error(
            "unable to calculate nutrition facts", {
            className: "dark:bg-neutral-800 dark:text-neutral-50"
          }
          )
          setRecipe(example)
          setIsError(true)
        }
      )
      setIsLoading(false)
    }
  }

  function onLog() {
    if (user === null) {
      setIsAuthorizeDialogOpen(true)
    } else {
      setIsMealDialogOpen(true)
    }
  }

  function onCreate() {
    if (user === null) {
      setIsAuthorizeDialogOpen(true)
    } else {
      // make api call
      create_food(session, recipe)
        .then((res) => {
          if (res.status === 201) {
            toast.success("created food", {
              className: "dark:bg-neutral-800 dark:text-neutral-50"
            })
          } else {
            toast.error("couldn't create food", {
              className: "dark:bg-neutral-800 dark:text-neutral-50"
            })
          }
        })
    }
  }

  return (
    <div
      className="bg-slate-100 dark:bg-neutral-900 dark:text-white grid grid-rows-[75px_1fr] h-screen overflow-x-hidden">
      <Toaster position="top-center" reverseOrder />
      <AuthorizeAppDialog open={isAuthorizeDialogOpen} onClose={() => setIsAuthorizeDialogOpen(false)} />
      <ChooseMealDialog recipe={recipe} open={isMealDialogOpen} onClose={() => setIsMealDialogOpen(false)} />
      <Nav user={user} />
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
    </div>
  )
}

export default App
