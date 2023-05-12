const API_URL = 'http://localhost:3000';

export async function getBooks() {
    const response = await fetch(`${API_URL}/books`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ email, password,first_name,last_name }),
    });

    const data = await response.json();
    return data;
}


export async function searchBookById(id) {
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export async function searchBooks(q) {
    const response = await fetch(`${API_URL}/books/search/${q}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ email, password,first_name,last_name }),
    });

    const data = await response.json();
    return data;
}


// Add a comment to a book
export const addComment = async (bookId, text) => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(`${API_URL}/books/${bookId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ text,userId:localStorage.getItem('userId') }),
    });

    const data = await response.json();
    return data;
}

// checkout
export const checkout = async (cart, discountCode) => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ cart, discountCode }),
    });

    const data = await response.json();
    return data;
}

// Order history
export const getOrders = async () => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': token,
        },
    });

    const data = await response.json();
    return data;
}

// change order status
export const changeOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return data;
}
