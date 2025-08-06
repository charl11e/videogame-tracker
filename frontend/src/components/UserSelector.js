function UserSelector ({
    selectedUserId,
    setSelectedUserId,
    users
}) {
    return (
        <div className="flex justify-end gap-2">
            <label htmlFor="user-select" className="text-xl px-1 py-2 font-medium">User:</label>
            <select id="user-select" value={selectedUserId} className="block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-800 bg-white"
            onChange={(e) => {
                const id = e.target.value;
                setSelectedUserId(id);
                localStorage.setItem('selectedUserId', id);
            }}>
                
                <option value="">-- Choose a user --</option>
                {users.map(user => (
                <option key={user.id} value ={user.id}>{user.username}</option>
                ))}
            </select>
        </div>
    )
}

export default UserSelector