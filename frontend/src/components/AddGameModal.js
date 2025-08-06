import * as api from '../api';

function AddGameModal({
    showAddGameModal,
    addModalRef,
    setShowAddGameModal,
    selectedUserId,
    setGames,
    setNewGameTitle,
    newGameTitle,
    newGamePlatform,
    setNewGamePlatform,
    newGameProgress,
    setNewGameProgress,
    newGameStatus,
    setNewGameStatus,
    setErrorMessage
}) {
    
    if (!showAddGameModal) return null;

    // Get slider colour
    function getSliderColour(progress) {
        let sliderColour = "accent-green-700"
          if (progress < 25) {
            sliderColour = 'accent-red-500';
          } else if (progress < 50) {
            sliderColour = 'accent-orange-500'
          } else if (progress < 100) {
            sliderColour = 'accent-green-500'
          }
          return sliderColour;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={addModalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-bold mb-4">Add Game</h3>

                <label className="block mb-2 text-xl font-semibold">
                    Title:
                    <input type="text" value={newGameTitle} className="w-full p-2 border rounded mt-1 font-normal"
                    onChange={(e) => setNewGameTitle(e.target.value)}></input>
                </label>

                <label className="block mb-2 text-xl font-semibold mb-4">
                    Platform:
                    <input type="text" value={newGamePlatform} className="w-full p-2 border rounded mt-1 font-normal"
                    onChange={(e) => setNewGamePlatform(e.target.value)}></input>
                </label>

                <label htmlFor="progress" className="block text-xl font-medium text-gray-700">
                    Completion: {newGameProgress}%
                </label>
                <input id="progress" type="range" min="0" max="100" step="5" className={`w-full ${getSliderColour(newGameProgress)}`} value={newGameProgress}
                onChange={(e) => setNewGameProgress(e.target.value)}></input>

                <label htmlFor="status-selector" className="block text-xl font-medium text-gray-700">Status:</label>
                <select id="status" value={newGameStatus} className="block w-full mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                onChange={(e) => {
                    setNewGameStatus(e.target.value)
                }}>
                    <option value="BACKLOG">Backlog</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="FINISHED">Finished</option>
                    <option value="ABANDONED">Abandoned</option>
                </select>

                <i className="text-m">You can add a game cover later when editing the game</i>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
                    onClick={() => setShowAddGameModal(false)}>Cancel</button>

                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                    onClick={async () => {
                        if (!newGameTitle || !newGamePlatform) {
                            setErrorMessage("Title and platform must not be blank")
                        } else {
                            try {
                                await api.addGame({
                                    title: newGameTitle,
                                    platform: newGamePlatform,
                                    userID: selectedUserId,
                                    status: newGameStatus,
                                    progress: newGameProgress
                                });

                                setShowAddGameModal(false);
                                const res = await api.getGamesByUser(selectedUserId);
                                setGames(res.data);
                            } catch (err) {
                                console.error("Error adding game: " + err);
                                setErrorMessage("Failed adding game (" + err + ")");

                            }
                        }
                    }}>Save</button>
                </div>
            </div>
        </div>

    )

}

export default AddGameModal;