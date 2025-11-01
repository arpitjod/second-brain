import {Input} from "../components/input"
import {Button} from "../components/Button.tsx"
import axios from "axios";
import {BACKEND_URL} from "../config";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function Signup(){
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate=useNavigate();
    async function signup(){
        const username=usernameRef.current?.value;
        const password=passwordRef.current?.value;
        
        if (!username || !password) {
            alert("Please enter both email and password");
            return;
        }
        
        try {
            const response = await axios.post(BACKEND_URL+"/api/v1/brain/signup",{
                username,
                password
            });
            alert("You have signed up successfully!")
        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data?.errors 
                    ? error.response.data.errors.join(', ') 
                    : error.response.data?.message || 'Signup failed';
                alert(`Signup failed: ${errorMessage}`);
            } else {
                alert("Signup failed. Please try again.");
            }
        }
        navigate("/Signin");
    }
     
    return <div className="bg-gray-200 h-screen w-screen flex justify-center items-center">
        <div className="bg-white rounded-xl  min-w-48 p-8">
            <Input ref={usernameRef} placeholder="Email (e.g., user@example.com)" type="email"/>
            <Input ref={passwordRef} placeholder="Password (min 6 characters)" type="password"/>
            <div className="flex justify-center pt-4">
                <Button onClick={signup} variant="primary" text="Signup"/>
            </div>
        </div>
    </div>
}