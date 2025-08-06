import EditGameModal from './components/EditGameModal';
import DeleteGameModal from './components/DeleteGameModal';
import ProgressModal from './components/ProgressModal';
import UserSelector from './components/UserSelector';
import Games from './components/Games';
import AddUserModal from './components/AddUserModal';
import AddGameModal from './components/AddGameModal';

import useGameUserData from './hooks/GameUserData';
import useModalMenu from './hooks/EditModalMenu';
import useAddModal from './hooks/AddModalMenu';
import AddButton from './components/AddButton';
import SettingsButton from './components/SettingsButton';
import useSettingsModal from './hooks/SettingsModalMenu';
import SettingsModal from './components/SettingsModal';
import ErrorBar from './components/ErrorBar'
import useErrorBarLogic from './hooks/ErrorBarLogic';
import FilterButton from './components/FilterButton';
import useFilterLogic from './hooks/FilterLogic';
import Footer from './components/Footer';
import Header from './components/Header';

function App() {

  const [errorMessage, setErrorMessage] = useErrorBarLogic();
  const { users, selectedUserId, games, setSelectedUserId, setGames, setUsers } = useGameUserData(setErrorMessage);
  const { openMenuId, editingGame, editedTitle, editedPlatform, deletingGame, setOpenMenuId, setEditingGame, setEditedTitle, setEditedPlatform, setDeletingGame, modalRef, menuRef, updatingGame, setUpdatingGame, updatedProgress, setUpdatedProgress, updatedStatus, setUpdatedStatus, editedGameCover, setEditedGameCover, gameCoverUrl, setGameCoverUrl } = useModalMenu();
  const { showAddGameModal, setShowAddGameModal, newGameTitle, setNewGameTitle, newGamePlatform, setNewGamePlatform, newGameProgress, setNewGameProgress, newGameStatus, setNewGameStatus, showAddUserModal, setShowAddUserModal, newUsername, setNewUsername, addModalRef} = useAddModal();
  const { showSettingsModal, setShowSettingsModal, settingsModalRef, updatedUsername, setUpdatedUsername } = useSettingsModal();
  const { filter, setFilter, sort, setSort, filteredGames } = useFilterLogic(games);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">

      <ErrorBar
        errorMessage = {errorMessage} >
      </ErrorBar>

      <Header/>
      
      <main className="flex-1 p-4 gap-4 items-center flex flex-col">

        {/* Buttons */}
        <div className="flex justify-end items-center gap-4 mt-2 w-full px-4">
          <UserSelector
            selectedUserId = {selectedUserId}
            setSelectedUserId = {setSelectedUserId}
            users = {users} >
          </UserSelector>
          <AddButton
            setShowAddGameModal = {setShowAddGameModal}
            setShowAddUserModal = {setShowAddUserModal} >
          </AddButton>
          <FilterButton
            filter = {filter}
            setFilter = {setFilter}
            sort = {sort}
            setSort = {setSort} >
          </FilterButton>
          <SettingsButton
            setShowSettingsModal = {setShowSettingsModal}>
          </SettingsButton>
        </div>

        {/* Display games for the selected user */}
        <Games
        games = {games}
        selectedUserId = {selectedUserId}
        setOpenMenuId = {setOpenMenuId}
        openMenuId = {openMenuId}
        setEditingGame = {setEditingGame}
        setEditedTitle = {setEditedTitle}
        setEditedPlatform = {setEditedPlatform}
        menuRef = {menuRef}
        setDeletingGame = {setDeletingGame}
        setUpdatingGame = {setUpdatingGame}
        setUpdatedProgress = {setUpdatedProgress}
        setUpdatedStatus = {setUpdatedStatus}
        filteredGames = {filteredGames} >
        </Games>

        {/* Edit Game Modal */}
        {editingGame && (
          <EditGameModal
          modalRef = {modalRef}
          editedTitle = {editedTitle}
          setEditedTitle = {setEditedTitle}
          editedPlatform = {editedPlatform}
          setEditedPlatform = {setEditedPlatform}
          setEditingGame = {setEditingGame}
          editingGame = {editingGame}
          selectedUserId = {selectedUserId}
          setGames = {setGames}
          editedGameCover = {editedGameCover}
          setEditedGameCover = {setEditedGameCover}
          setErrorMessage = {setErrorMessage}
          gameCoverUrl = {gameCoverUrl}
          setGameCoverUrl = {setGameCoverUrl} >
          </EditGameModal>
        )}
        

        {/* Delete Game Modal */}
        {deletingGame && (
          <DeleteGameModal
          deletingGame = {deletingGame}
          modalRef = {modalRef}
          setDeletingGame = {setDeletingGame}
          setGames = {setGames}
          selectedUserId = {selectedUserId}
          setErrorMessage = {setErrorMessage} >
          </DeleteGameModal>
        )}

        {/* Update progress Modal */}
        {updatingGame && (
          <ProgressModal
          modalRef = {modalRef}
          setUpdatingGame = {setUpdatingGame}
          updatingGame = {updatingGame}
          selectedUserId = {selectedUserId}
          updatedProgress = {updatedProgress}
          updatedStatus = {updatedStatus}
          setGames = {setGames}
          setUpdatedProgress = {setUpdatedProgress}
          setUpdatedStatus = {setUpdatedStatus}
          setErrorMessage = {setErrorMessage} >
          </ProgressModal>
        )}

        {/* Add user modal */}
        {showAddUserModal && (
          <AddUserModal
          showAddUserModal = {showAddUserModal}
          addModalRef = {addModalRef}
          newUsername = {newUsername}
          setNewUsername = {setNewUsername}
          setShowAddUserModal = {setShowAddUserModal}
          setUsers = {setUsers}
          setErrorMessage = {setErrorMessage} >
          </AddUserModal>
        )}

        {/* Add game modal */}
        {showAddGameModal && (
          <AddGameModal
          showAddGameModal = {showAddGameModal}
          addModalRef = {addModalRef}
          setShowAddGameModal = {setShowAddGameModal}
          selectedUserId = {selectedUserId}
          setGames = {setGames}
          setNewGameTitle = {setNewGameTitle}
          newGameTitle = {newGameTitle}
          newGamePlatform = {newGamePlatform}
          setNewGamePlatform = {setNewGamePlatform}
          newGameProgress = {newGameProgress}
          setNewGameProgress = {setNewGameProgress}
          newGameStatus = {newGameStatus}
          setNewGameStatus = {setNewGameStatus}
          setErrorMessage = {setErrorMessage} >
          </AddGameModal>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal
            showSettingsModal = {showSettingsModal}
            settingsModalRef = {settingsModalRef}
            setShowSettingsModal = {setShowSettingsModal}
            selectedUserId = {selectedUserId}
            setSelectedUserId = {setSelectedUserId}
            setUsers = {setUsers}
            setErrorMessage = {setErrorMessage}
            updatedUsername = {updatedUsername}
            setUpdatedUsername = {setUpdatedUsername} >
          </SettingsModal>
        )}

      </main>

      <Footer/>

    </div>

  );
}

export default App;