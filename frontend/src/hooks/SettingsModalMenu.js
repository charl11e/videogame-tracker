import {useState, useEffect, useRef} from 'react';

function useSettingsModal() {

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const [updatedUsername, setUpdatedUsername] = useState(null);

    const settingsModalRef = useRef(null);
    useEffect(() => {
        function handeClickOutsideSettingsModal(event) {
            if (settingsModalRef.current && !settingsModalRef.current.contains(event.target)) {
                setShowSettingsModal(false);
            }
        }

        function handleKeyOutsideSettingsModal(event) {
            if (event.key === 'Escape') {
                setShowSettingsModal(false);
            }
        }

        document.addEventListener('mousedown', handeClickOutsideSettingsModal);
        document.addEventListener('keydown', handleKeyOutsideSettingsModal);

        return () => {
            document.removeEventListener('mousedown', handeClickOutsideSettingsModal)
            document.removeEventListener('keydown', handleKeyOutsideSettingsModal)
        }

    }, [])

    return {
        showSettingsModal,
        setShowSettingsModal,
        settingsModalRef,
        updatedUsername,
        setUpdatedUsername
    };
}

export default useSettingsModal;