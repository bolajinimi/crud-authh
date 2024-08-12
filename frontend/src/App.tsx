
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import {User} from './models/user';
import {useEffect, useState} from "react";
import * as NotesApi from "./network/notes_api"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';



function App() {
  const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLogInModal, setShowLogInModal] = useState(false);


useEffect(() =>{
  async function fetchLoggedInUser(){
    try {
      const user = await NotesApi.getLoggedInUser();
      setLoggedInUser(user);
    } catch (error) {
      console.log(error);
    }
  }
  fetchLoggedInUser();
}, []);


  return (
    <BrowserRouter>
    <div>
      <NavBar
      loggedInUser={loggedInUser}
      onLoginClicked={()=> setShowLogInModal(true)}
      onSignUpClicked={()=> setShowSignUpModal(true)}
      onLogoutSuccessful={() => {
        console.log("Logging out");
        setLoggedInUser(null);
      }}
      />
      <Container>
        <Routes>
          <Route
          path="/"
          element={<NotesPage loggedInUser={loggedInUser}/>}
          />
          <Route
          path="/privacy"
          element={<PrivacyPage/>}
          />
          <Route
          path="/*"
          element={<NotFoundPage/>}
          />
        </Routes>
      </Container>
   
    {
          showSignUpModal&&
          
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessful={(user) => {
               setLoggedInUser(user);     
               setShowSignUpModal(false) 
              }
            }
            
          />
        }
        {
          showLogInModal &&
          
          <LoginModal
            onDismiss={() => setShowLogInModal(false)}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user); 
              setShowLogInModal(false)
            }
            }
            
          />
        }
    </div>
  </BrowserRouter>
  );
}

export default App;
