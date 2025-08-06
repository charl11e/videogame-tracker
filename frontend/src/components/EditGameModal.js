import * as api from '../api.js';
import { useState, useEffect } from 'react';

const UPLOAD_LIMIT = 5 * 1024 * 1024; // 5mb limit

function EditGameModal({
    modalRef,
    editedTitle,
    setEditedTitle,
    editedPlatform,
    setEditedPlatform,
    setEditingGame,
    editingGame,
    selectedUserId,
    setGames,
    editedGameCover,
    setEditedGameCover,
    setErrorMessage,
    gameCoverUrl,
    setGameCoverUrl
}) {

    // Handle colour of background of URL upload
    const [urlColour, setUrlColour] = useState("");
    
    useEffect(() => {
        if (!gameCoverUrl) {
            setUrlColour("");
            return;
        }

        const handler = setTimeout(() => {
            getUrlBackground(gameCoverUrl).then(setUrlColour);
        }, 1500);

        return () => clearTimeout(handler);

    }, [gameCoverUrl])

    const getUrlBackground = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');
            if (response.ok && contentType && contentType.startsWith('image/')) {
                return 'border-green-500'
            } else {
                return 'border-red-500'
            }
        } catch {
            return 'border-red-500'
        }
    }

    if (!editingGame) return null;
    
    // Handle image upload via URL
    const handleImageUploadUrl = async (url, id) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            if (blob.size > UPLOAD_LIMIT) {
                setErrorMessage("Image file must be less than 5MB")
                return;
            }

            const file = new File([blob], "cover.jpg", {type: blob.type})

            const formData = new FormData();
            formData.append("file", file);

            await api.uploadGameCover(id, file);
        } catch (err) {
            console.error("Error uploading image from URL: " + err)
            setErrorMessage("Failed uploading image from URL (" + err + ")");
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-bold mb-4">Edit Game</h3>

                <label className="block mb-2 text-xl font-semibold">
                    Title:
                    <input type="text" value={editedTitle} className="w-full p-2 border rounded mt-1 font-normal"
                    onChange={(e) => setEditedTitle(e.target.value)}></input>
                </label>

                <label className="block mb-2 text-xl font-semibold">
                    Platform:
                    <input type="text" value={editedPlatform} className="w-full p-2 border rounded mt-1 font-normal"
                    onChange={(e) => setEditedPlatform(e.target.value)}></input>
                </label>

                <label className="block mb-2 text-xl font-semibold">
                    Cover image:
                    <input type="file" accept="image/*" className="w-full p-2 border rounded mt-1 font-normal"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file.size > UPLOAD_LIMIT) {
                            setErrorMessage("Image file must be less than 5MB");
                            e.target.value = "";
                        } else {
                        setEditedGameCover(file)}
                        }
                    }
                    ></input>
                </label>

                <label className="block mb-2 text-lg font-semibold">
                    Or upload from image URL:
                    <input type="text" className={`w-full border rounded mt-1 font-normal border-4 ${urlColour} focus:outline-none`}
                    onChange={(e) => setGameCoverUrl(e.target.value)}></input>
                </label>

                <i className="text-m">Must be an image file. Max size: 5MB</i>

                <div className="flex justify-end gap-2 mt-4">

                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
                    onClick={() => setEditingGame(null)}>Cancel</button>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                    onClick={async () => {
                        if (!editedTitle || !editedPlatform) {
                            setErrorMessage("Title and platform must not be blank")
                        } else {
                            try {
                                await api.updateGame(editingGame.id, {
                                    title: editedTitle,
                                    platform: editedPlatform,
                                    userID: selectedUserId,
                                    status: editingGame.status,
                                    progress: editingGame.progress
                                });

                                // Upload new game cover if uploaded
                                if (editedGameCover) {
                                    await api.uploadGameCover(editingGame.id, editedGameCover);
                                }

                                if (gameCoverUrl) {
                                    await handleImageUploadUrl(gameCoverUrl, editingGame.id);
                                    setGameCoverUrl(null);
                                }

                                setEditingGame(null);
                                const res = await api.getGamesByUser(selectedUserId);
                                setGames(res.data);

                            } catch (err) {
                                console.error("Error updating game: ", err);
                                setErrorMessage("Failed updating game (" + err + ")");
                            }
                        }
                    }}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default EditGameModal;