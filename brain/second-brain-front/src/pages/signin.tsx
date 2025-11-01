import {Input} from "../components/input"
import {Button} from "../components/Button.tsx"
import axios from "axios";
import {BACKEND_URL} from "../config";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function Signin(){
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
    async function signin(){
        const username=usernameRef.current?.value;
        const password=passwordRef.current?.value;
        const response = await axios.post(BACKEND_URL+"/api/v1/brain/signin",{
            username,
            password
        });
        const jwt=response.data.token;
        localStorage.setItem("token",jwt)
        navigate("/dashboard"); // 👈 takes the user to /login page

    }

     
    return <div className="bg-gray-200 h-screen w-screen flex justify-center items-center">
        <div className="bg-white rounded-xl  min-w-48 p-8">
            <Input ref={usernameRef} placeholder="Email (e.g., user@example.com)" type="email"/>
            <Input ref={passwordRef} placeholder="Password (min 6 characters)" type="password"/>
            <div className="flex justify-center pt-4">
                <Button onClick={signin} variant="primary" text="Signin"/>
            </div>
        </div>
    </div>
}