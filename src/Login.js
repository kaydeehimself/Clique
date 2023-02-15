import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from './features/userSlice'
import { auth } from './firebase'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const dispatch = useDispatch()

    
    const register = (event) => {
        event.preventDefault();
      
        if (!name) {
          return alert('Please enter a full name');
        }
      
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((userAuth) => {
            userAuth.user
              .updateProfile({
                displayName: name,
                photoURL: profilePic,
            })
            .then(() => {
                dispatch(
                    login({
                        email: userAuth.user.email,
                        uid: userAuth.user.uid,
                        displayName: name,
                        photoURL: profilePic,
                    })
                );
            })
            .catch((error) => {
            // Display the error message to the user in some way
            alert(error.message);
            });
            })
        .catch((error) => {
        // Display the error message to the user in some way
        alert(error.message);
        });
    };
      
    const loginToApp = (event) => {
        event.preventDefault();
      
        auth
        .signInWithEmailAndPassword(email, password)
        .then((userAuth) => {
            dispatch(
                login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: userAuth.user.displayName,
                photoURL: userAuth.user.photoURL,
                })
            );
        })
        .catch((err) => {            
            alert('Sign in/Register unsuccessful, try again');
            console.log(err)
        });
    };
      
    return (
    <div className="login">
        <h2 className='logo-login'>Cliq<span>u</span>e</h2>    
        <form onSubmit={loginToApp}>
        <input
            placeholder="Full name (required if registering)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
    
        <input
            placeholder="Profile Picture URL (optional)"
            type="text"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
        />
    
        <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
    
            <button type="submit">Sign in</button>
        </form>
        <p>
            Not a member?{' '}
            <span className="login_register" onClick={register}>
            Register Now
            </span>
        </p>
        </div>
    );
        
}

export default Login