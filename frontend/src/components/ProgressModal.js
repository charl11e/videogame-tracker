import * as api from '../api.js';

function ProgressModal({
    modalRef,
    setUpdatingGame,
    updatingGame,
    selectedUserId,
    updatedProgress,
    setUpdatedProgress,
    updatedStatus,
    setGames,
    setUpdatedStatus,
    setErrorMessage
}) {

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
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-bold mb-4">Update Game</h3>

                <label htmlFor="progress" className="block text-xl font-medium text-gray-700">
                    Completion: {updatedProgress}%
                </label>
                <input id="progress" type="range" min="0" max="100" step="5" className={`w-full ${getSliderColour(updatedProgress)}`} value={updatedProgress}
                onChange={(e) => setUpdatedProgress(e.target.value)}></input>

                <label htmlFor="status-selector" className="block text-xl font-medium text-gray-700">
                    Status:
                </label>
                <select id="status" value={updatedStatus} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                onChange={(e) => {
                    setUpdatedStatus(e.target.value)
                }}>
                    <option value="BACKLOG">Backlog</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="FINISHED">Finished</option>
                    <option value="ABANDONED">Abandoned</option>
                </select>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
                    onClick={() => setUpdatingGame(null)}>Cancel</button>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                    onClick={async () => {
                        try {
                            await api.updateGame(updatingGame.id, {
                                title: updatingGame.title,
                                platform: updatingGame.platform,
                                userID: selectedUserId,
                                status: updatedStatus,
                                progress: updatedProgress
                            });

                            setUpdatingGame(null);
                            const res = await api.getGamesByUser(selectedUserId);
                            setGames(res.data);
                        } catch (err) {
                            console.error("Error updating progress: " + err)
                            setErrorMessage("Failed to update progress (" + err + ")");

                        }
                    }}>Save</button>

                </div>
            </div>
        </div>
    )
}

export default ProgressModal