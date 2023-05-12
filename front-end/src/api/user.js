const API_URL = 'http://localhost:3000';

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
}


export async function getUserData(userId) {
    const token = localStorage.getItem('jwt');

    const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: {
            'Authorization': token,
        },
    });

    const data = await response.json();
    return data;
}


export async function registerUser(email, password,first_name,last_name) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password,first_name,last_name }),
    });
    if(response.status===400){
        return {message:"User already exists"}
    }
    const data = await response.json();
    return data;
}


