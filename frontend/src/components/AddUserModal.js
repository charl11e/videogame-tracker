import * as api from '../api';

function AddUserModal({
    showAddUserModal,
    addModalRef,
    newUsername,
    setNewUsername,
    setShowAddUserModal,
    setUsers,
    setErrorMessage
}) {
    
    if (!showAddUserModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={addModalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-bold mb-4">Add User</h3>

                <label className="block mb-2 text-xl font-semibold">
                    Username:
                    <input type="text" value={newUsername} className="w-full p-2 border rounded mt-1 font-normal"
                    onChange={(e) => setNewUsername(e.target.value)}></input>
                </label>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
                    onClick={() => setShowAddUserModal(false)}>Cancel</button>

                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                    onClick={async () => {
                        if (!newUsername) {
                            setErrorMessage("Username must not be blank")
                        } else {
                            try {
                                await api.addUser({
                                    username: newUsername
                                })
                                setShowAddUserModal(false);
                                const res = await api.fetchUsers();
                                setUsers(res.data);
                            } catch (err) {
                                console.error("Error adding user: " + err)
                                setErrorMessage("Failed adding user (" + err + ")");
                            }
                        }
                    }}>Save</button>
                </div>
            </div>
        </div>

    )

}

export default AddUserModal;