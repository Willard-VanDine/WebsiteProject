import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { registerUser } from "./api";

export default function RegisterScreen() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    return (
        <section className="heightFixer rounder centerObjects">
            <h1>Register New User</h1>
            <p>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" onChange={(e) => {
                    setUsername(e.target.value);
                }}
                className="form-control"
                ></input>
            </p>
            <p>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={(e) => {
                    setPassword(e.target.value);
                }}
                className="form-control"
                >


                </input>
            </p>
            <p><button onClick={async () => {
                if(await registerUser(username, password)=== true){
                    alert("Register succesfull!");
                }else{
                    alert("Some sort of error occured!");
                }
                navigate("/");
            }}>Register </button></p>
            <NavLink to="/" end>Back to login screen</NavLink>
        </section>
    )

}