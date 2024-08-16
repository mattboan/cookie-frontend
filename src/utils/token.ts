

// Function for getting the token from the local storage
export const getToken = () => {
    const token = localStorage.getItem('token');
    const last_login = localStorage.getItem('last_login');

    // Check to see if last_login was 20 days ago
    if (last_login) {
        const last_login_date = new Date(last_login);
        const now = new Date();
        const diff = now.getTime() - last_login_date.getTime();
        const diffDays = diff / (1000 * 3600 * 24);
        if (diffDays > 20) {
            localStorage.removeItem('token');
            localStorage.removeItem('last_login');
            return null;
        }
    }

    return token;
}

// Function for setting the token in the local storage
export const setToken = (token: string) => {
    localStorage.setItem('token', token);
}