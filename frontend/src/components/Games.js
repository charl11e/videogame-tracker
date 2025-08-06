function Games ({
    games,
    selectedUserId,
    setOpenMenuId,
    openMenuId,
    setEditingGame,
    setEditedTitle,
    setEditedPlatform,
    menuRef,
    setDeletingGame,
    setUpdatingGame,
    setUpdatedProgress,
    setUpdatedStatus,
    filteredGames
}) {
    
    return (

      <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredGames.length === 0 && selectedUserId && 
        <li className="font-semibold col-span-full">No games found for user - add your first game or your filters may be too exclusive!</li>}
        {filteredGames.map (game => {

          // Calculate progress bar colour
          let progressColour = 'bg-green-700';
          if (game.progress < 25) {
            progressColour = 'bg-red-500';
          } else if (game.progress < 50) {
            progressColour = 'bg-orange-500'
          } else if (game.progress < 100) {
            progressColour = 'bg-green-500'
          }
        
        return (
          
          <li key={game.id} className="bg-white rounded-xl shadow-lg flex flex-col gap-4 p-4 w-72 min-h-28 relative group hover:shadow-2xl" style={{ alignItems: 'flex-start' }}>
                        
            {/* Hover effect for managing game */}
            <button className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 hidden group-hover:block text-3xl" title="Manage game"
            onClick={(e) => {
              setOpenMenuId (openMenuId === game.id ? null : game.id)
            }}
            >⋮</button>

            {/* Dropdown menu for managing game */}
            {openMenuId === game.id && (
              <div ref={menuRef} className="absolute top-14 right-2 bg-white border rounded-md shadow-md z-10">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={(e) => {
                  setEditingGame(game);
                  setEditedTitle(game.title);
                  setEditedPlatform(game.platform);
                  setOpenMenuId(null);
                }}
                >Edit</button>

                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={(e) => {
                  setUpdatingGame(game);
                  setUpdatedStatus(game.status);
                  setUpdatedProgress(game.progress);
                  setOpenMenuId(null);
                }}>
                  Progress
                </button>

                <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                onClick={(e) => {
                  setDeletingGame(game);
                  setOpenMenuId(null);
                }}
                >Delete</button>
              </div>
              )}

            {/* Game info */}
            <div className="flex items-center gap-4" style={{alignItems:'flex-start'}}>
              
              {/* Display game cover image //TODO change URL when finish */}
              {game.coverImage != null && <img src={`http://localhost:8080${game.coverImage}`} alt={`${game.title} cover`} className="max-w-full max-h-full w-32 h-48 object-contain rounded" />}
              {game.coverImage === null && <div className="w-32 h-48 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center"></div>}
              
              <div className="pr-6">

                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-800 break-words hyphens-auto">{game.title}</p>

                  {game.status === "BACKLOG" && <img src="/icons/backlog.svg" alt="Backlog" title="Backlog" className="w-5 h-5"></img>}
                  {game.status === "IN_PROGRESS" && <img src="/icons/in-progress.svg" alt="In Progress" title="In Progress" className="w-5 h-5"></img>}
                  {game.status === "FINISHED" && <img src="/icons/finished.svg" alt="Finished" title="Finished" className="w-5 h-5"></img>}
                  {game.status === "ABANDONED" && <img src="/icons/abandoned.svg" alt="Abandoned" title="Abandoned" className="w-5 h-5"></img>}

                </div>

                <p className="text-sm text-gray-500">{game.platform}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full flex items-center justify-between mt-1 gap-2">
              <div className="h-2 w-full h-2 bg-gray-300 rounded mt-2">
                <div className={`h-full ${progressColour} rounded`} style={{ width: `${game.progress}%` }}></div>
              </div>
              <span className="h-3 text-s text-gray-600 font-medium w-10 text-center leading-none">{game.progress}%</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Games;