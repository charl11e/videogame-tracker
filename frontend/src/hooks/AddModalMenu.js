import {useState, useEffect, useRef} from 'react';


// Covers modals for adding new games/users
function useAddModal() {
    
    // Add game use states
    const [showAddGameModal, setShowAddGameModal] = useState(false);

    const [newGameTitle, setNewGameTitle] = useState("");
    const [newGamePlatform, setNewGamePlatform] = useState("");
    const [newGameProgress, setNewGameProgress] = useState(0);
    const [newGameStatus, setNewGameStatus] = useState("IN_PROGRESS");

    // Add user use states
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUsername, setNewUsername] = useState("User");

    // Close modals
    const addModalRef = useRef(null);
    useEffect(() => {
        function handleClickOutsideAddModal(event) {
            if (addModalRef.current && !addModalRef.current.contains(event.target)) {
                setShowAddGameModal(false);
                setShowAddUserModal(false);
            }
        }

        function handleKeyOutsideAddModal(event) {
            if (event.key === 'Escape') {
                setShowAddGameModal(false);
                setShowAddUserModal(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutsideAddModal);
        document.addEventListener('keydown', handleKeyOutsideAddModal);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideAddModal);
            document.removeEventListener('keydown', handleKeyOutsideAddModal);
        }

    }, [])

    return {
        showAddGameModal,
        setShowAddGameModal,
        newGameTitle,
        setNewGameTitle,
        newGamePlatform,
        setNewGamePlatform,
        newGameProgress,
        setNewGameProgress,
        newGameStatus,
        setNewGameStatus,
        showAddUserModal,
        setShowAddUserModal,
        newUsername,
        setNewUsername,
        addModalRef
    }

}

export default useAddModal;