import React, { useState } from 'react'
import { FormControl, FormLabel, Input, FormHelperText, Button } from "@chakra-ui/react";
import "../stylesheets/LoginForm.scss";

interface User {
    email: string;
    password: string;
}
 
interface LoginFormProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void; // Define the prop type for setIsLoggedIn
} 

const LoginForm = ({ setIsLoggedIn }: LoginFormProps) => {
    const [user, setUser] = useState<User>({
        email: '', 
        password: '',
    })
    const login = (user: User) => {
        console.log('User:', user);
        fetch('http://localhost:3001/users/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            //credentials: 'include', 
            body: JSON.stringify(user),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setIsLoggedIn(true);
        })
        .catch((err) => {
            console.error('Error logging in:', err);
        });
    }
   
  
    return (
        <FormControl  className='form-input'>
            <FormLabel>Email</FormLabel>
            <Input 
                type='email'
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })} 
            />
            <FormLabel>Mot de passe</FormLabel>
            <Input 
                type='password'
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})} 
            />
            <Button colorScheme='blue' className="submit-button" onClick={() => {
            //console.log(e)
            login(user)
            }}>Confirmer</Button>
        </FormControl>
    )
}

export default LoginForm