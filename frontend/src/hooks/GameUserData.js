import {useState, useEffect} from 'react';
import * as api from '../api';

function useGameUserData(
    setErrorMessage
) {
    
    // Setup useState for selecting a user, and their games
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [games, setGames] = useState([]);

    // Get list of users
    useEffect(() => {
        async function fetchUsers() {
            try {
                let res = await api.fetchUsers();
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setErrorMessage("Failed fetching users (" + err + ")");
            }
        }
        fetchUsers();
    }, [setErrorMessage]);

    // Get games for the selected user
    useEffect(() => {
        async function fetchGames() {
            try {
                if (selectedUserId) {
                    let res = await api.getGamesByUser(selectedUserId);
                    setGames(res.data);
                } else {
                    setGames([]);
                }
            } catch (err) {
                console.error("Error fetching games for user:", err);
                setErrorMessage("Failed loading games for selected user (" + err + ")")
            }
        }
        fetchGames()
    }, [selectedUserId, setErrorMessage]);

    // Restore selected user from localstorage on initial load
    useEffect(() => {
    const savedUserId = localStorage.getItem('selectedUserId');
    if (savedUserId) {
        setSelectedUserId(savedUserId);
    }
    }, [])

    return {
        users,
        selectedUserId,
        games,
        setSelectedUserId,
        setGames,
        setUsers
    }
}

export default useGameUserData;