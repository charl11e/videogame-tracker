import {useState, useEffect, useRef} from 'react';


// Covers modals for editing/deleting/updating games
function useModalMenu() {

  // Setup use states to manage game menus
  const [openMenuId, setOpenMenuId] = useState(null);

  // Setup use states to manage editing games
  const [editingGame, setEditingGame] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPlatform, setEditedPlatform] = useState('');

  // Setup use states to manage deleting games
  const [deletingGame, setDeletingGame] = useState(null);

  // Setup use states to manage updating game progress
  const [updatingGame, setUpdatingGame] = useState(null);
  const [updatedProgress, setUpdatedProgress] = useState(0);
  const [updatedStatus, setUpdatedStatus] = useState("IN_PROGRESS");

  // Updating game cover
  const [editedGameCover, setEditedGameCover] = useState(null);
  const [gameCoverUrl, setGameCoverUrl] = useState(null);

  // Event listener to close dropdown menu when clicking outside
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Reset hooks when modal closes
  function closeModal() {
    setDeletingGame(null);
    setEditingGame(null);
    setEditedTitle('');
    setEditedPlatform('');
    setUpdatingGame(null);
    setUpdatedProgress(0);
    setUpdatedStatus("IN_PROGRESS");
  }

  // Event listener to close modal when clicking outside
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutsideModal(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }

    function handleKeyOutsideModal(event) {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutsideModal);

    document.addEventListener('keydown', handleKeyOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
      document.removeEventListener('keydown', handleKeyOutsideModal);
    }
  }, [])

  return {
    openMenuId,
    editingGame,
    editedTitle,
    editedPlatform,
    deletingGame,
    setOpenMenuId,
    setEditingGame,
    setEditedTitle,
    setEditedPlatform,
    setDeletingGame,
    modalRef,
    menuRef,
    updatingGame,
    setUpdatingGame,
    updatedProgress,
    setUpdatedProgress,
    updatedStatus,
    setUpdatedStatus,
    editedGameCover,
    setEditedGameCover,
    gameCoverUrl,
    setGameCoverUrl
  }

} 

export default useModalMenu;