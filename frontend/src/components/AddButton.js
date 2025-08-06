import { useState, useRef, useEffect } from 'react';

function AddButton({
    setShowAddGameModal,
    setShowAddUserModal
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])


    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            onClick={() => setOpen(!open)}>
                <img src='/icons/add.svg' alt="Add" title="Add" className="w-5 h-5"></img>
            </button>

            {open && (
                <div className="absolute top-12 right-0 bg-white border rounded-md shadow-md z-50">
                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left whitespace-nowrap"
                    onClick={(e) => {
                        setOpen(false);
                        setShowAddGameModal(true);
                    }}
                    >Add Game</button>

                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left whitespace-nowrap"
                    onClick={(e) => {
                        setOpen(false);
                        setShowAddUserModal(true);
                    }}
                    >Add User</button>
                </div>
            )}
        </div>
    )

}

export default AddButton;