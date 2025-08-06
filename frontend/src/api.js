import axios from 'axios';

const API = axios.create( {
    baseURL: 'http://localhost:8080/api'
})

export const fetchUsers = async () => {
    try {
        return await API.get('/users');
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const addUser = async (user) => {
    try {
        return await API.post('/users', user);
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const delUser = async (id) => {
    try {
        return await API.delete('/users/' + id);
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const updateUser = async (id, user) => {
    try {
        return await API.put('/users/' + id, user);
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const getGamesByUser = async (id) => {
    try {
        return await API.get('/users/' + id + '/games');
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const fetchGames = async () => {
    try {
        return await API.get('/games');
    } catch (err) {
        throw getApiErrorMessage(err);
    } 
}

export const addGame = async (game) => {
    try {
        return await API.post('/games', game);
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const delGame = async (id) => {
    try {
        return await API.delete('/games/' + id);
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const updateGame = async (id, game) => {
    try {
        return await API.put('/games/' + id, game);
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

export const uploadGameCover = async (id, uploadFile) => {
    try {
        const formData = new FormData();
        formData.append("file", uploadFile);
        return API.put(`/games/${id}/cover`, formData)
    } catch (err) {
        throw getApiErrorMessage(err);
    }
}

function getApiErrorMessage(error) {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message
    }
    if (error.response && error.response.data) {
        return error.response.data;
    }
    if (error.message) {
        return error.message;
    }
    return "Unknown Error";
}