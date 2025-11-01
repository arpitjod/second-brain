import {Signup} from"./pages/signup"
import {Signin} from"./pages/signin"
import {Dashboard} from"./pages/dashboard"
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom"
function App() {
  return <BrowserRouter>
     <Routes>
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/signup" element={<Signup/>} />


     </Routes>
  </BrowserRouter>
}

export default App























































































