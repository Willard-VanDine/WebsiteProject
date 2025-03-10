import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { registerUser } from "./api";

export default function RegisterScreen() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    // Username validation logic
    const isUsernameValid = username.length >= 3 && username.length <= 20;
    // Password validation logic
    const isPasswordValid = password.length >= 5 && password.length <= 50;

    return (
        <section className="heightFixer rounder centerObjects">
            <h1>Register New User</h1>
            <p>
                <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    value={username}
                    minLength={3} 
                    maxLength={20} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                />
                <small className={!isUsernameValid ? "text-danger" : ""}
                       style={{ visibility: isUsernameValid ? "hidden" : "visible" }}>
                    Username must be between 3 and 20 characters.
                </small>
            </p>
            <p>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password}
                    minLength={5} 
                    maxLength={50} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                />
                <small className={!isPasswordValid ? "text-danger" : ""}
                       style={{ visibility: isPasswordValid ? "hidden" : "visible" }}>
                    Password must be between 5 and 50 characters.
                </small>
            </p>
            <p>
                <button 
                    onClick={async () => {
                        if (!isUsernameValid || !isPasswordValid) {
                            alert("Please make sure your username and password meet the length requirements.");
                            return;
                        }
                        if (await registerUser(username, password) === true) {
                            alert("Registration successful!");
                        } else {
                            alert("An error occurred!");
                        }
                        navigate("/");
                    }}
                    disabled={!isUsernameValid || !isPasswordValid}
                >
                    Register
                </button>
            </p>
            <NavLink to="/" end>Back to login screen</NavLink>
        </section>
    );
}
