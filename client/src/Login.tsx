import { NavLink, useNavigate } from "react-router";
import { login } from "./api";
import { useState } from "react";
import { useAuth } from "./useAuth";


interface LoginProps {
    isLoggedIn: boolean | null;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean|null>>;
  }

export default function LoginScreen({ isLoggedIn, setIsLoggedIn }: LoginProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        // Call the login function to authenticate the user
        const success = await login(username, password);

        if (success?.loggedIn) {
            // If login is successful, update the authentication state
            setIsLoggedIn(true);  // Update state to reflect the logged-in status
            navigate("/"); // Redirect to the homepage or a different page after login
        } else {
            // Handle login failure (optional)
            alert("Login failed. Please check your username and password.");
        }
    };
    
    return (
        <section className="heightFixer centerObjects rounder">
            <h1>Login Page</h1>
                <p>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" onChange={(e) => {
                    setUsername(e.target.value);
                }}></input>
            </p>
            <p>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={(e) => {
                    setPassword(e.target.value);
                }}></input>
                </p>
                <p><button onClick={handleLogin}>Log In</button></p>
            <NavLink to="/register" end>Register new user</NavLink>
        </section>
    );
}