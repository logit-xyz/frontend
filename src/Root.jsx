import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import NavBar from "./components/NavBar"
import App from "./pages/Home"
import FAQ from "./pages/FAQ"
import RecipeBuilder from "./pages/RecipeBuilder"
import NotFoundPage from "./pages/404"
import AuthSuccess from "./pages/AuthSuccess"
import { useSafeLocalStorage } from "./hooks/useSafeLocalStorage"

function Root() {
    const [session, setSession] = useSafeLocalStorage("session", null)

    return (
        <div className="bg-slate-100 dark:bg-slate-900 dark:text-white grid grid-rows-[75px_1fr] h-screen overflow-x-hidden">
            <Toaster position="top-center" reverseOrder />
            <BrowserRouter>
                <NavBar session={session} callback={setSession}/>
                <Routes>
                    <Route path="/" element={<App session={session} callback={setSession}/>} />
                    <Route path="/builder" element={<RecipeBuilder session={session} callback={setSession}/>} />
                    <Route path="/faq" element={<FAQ />} />
                    {/* TODO: finish the two pages */}
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/success" element={<AuthSuccess />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Root 
