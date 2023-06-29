export const getClientToken = () => {
    return localStorage.getItem('client-token') ? JSON.parse(localStorage.getItem('client-token')) : "";
}

export const getAdminToken = () => {
    return localStorage.getItem('admin-token') ? JSON.parse(localStorage.getItem('admin-token')) : "";
}
