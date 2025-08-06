function SettingsButton({
    setShowSettingsModal
}) {

    return (
        <div className="relative inline-block">
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
            onClick={() => setShowSettingsModal(true)}>
                <img src="/icons/settings.svg" alt="Settings" title="Settings" className="w-5 h-5"></img>
            </button>
        </div>
    )

}

export default SettingsButton