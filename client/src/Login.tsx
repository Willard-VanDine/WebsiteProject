import { NavLink, useNavigate } from "react-router";
import { login } from "./api";
import { useState, useEffect } from "react";



interface LoginProps {
    isLoggedIn: boolean | null;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const LoginScreen = ({ isLoggedIn, setIsLoggedIn }: LoginProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    // Redirect immediately if not logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");  // Redirect to login if not logged in
        }
    }, [isLoggedIn, navigate]);

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
    // if a user logged in do not render this component, if they are render it.
    return (
        isLoggedIn === false ? (
            <section className="heightFixer centerObjects rounder">
                <h1>Login Page</h1>
                <p>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </p>
                <p>
                    <button onClick={handleLogin}>Log In</button>
                </p>
                <NavLink to="/register" end>
                    Register new user
                </NavLink>
            </section>
        ) : (
            <div>
                <p>Redirecting to login...</p>
            </div> // div that will replace the component if not logged in, will be redirected anyway.
        )
    );
};
export default LoginScreen;