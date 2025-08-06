import * as api from '../api.js'

function DeleteGameModal({
    deletingGame,
    modalRef,
    setDeletingGame,
    setGames,
    selectedUserId,
    setErrorMessage
}) {

    if (!deletingGame) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-bold mb-4 text-red-500">Delete Game</h3>

                <h4 className="text-lg font-semibold mb-4">Are you sure you want to delete this game?</h4>
                <h4 className="text-lg font-semibold mb-4 underline">This action is irreversible</h4>

                <div className="flex justify-end gap-2 mt-4">

                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
                    onClick={() => setDeletingGame(null)}>Cancel</button>

                    <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-700 font-semibold text-white"
                    onClick={async () => {
                        try {
                            await api.delGame(deletingGame.id);

                            setDeletingGame(null)
                            const res = await api.getGamesByUser(selectedUserId);
                            setGames(res.data);
                        } catch (err) {
                            console.error("Error deleting game: " + err);
                            setErrorMessage("Failed deleting game (" + err + ")");
                        }
                    }}>Confirm</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteGameModal