import { useState, useEffect } from 'react';

function useFilterLogic(games) {
    const [filter, setFilter] = useState(["FINISHED", "IN_PROGRESS", "BACKLOG", "ABANDONED"]);
    const [sort, setSort] = useState("az");
    const [filteredGames, setFilteredGames] = useState([]);

    // Select games to display based on current filter and sort based on current sort
    useEffect(() => {
        let result = [];
        for (const game of games) {
            if (filter.includes(game.status)) {
                result.push(game);
            }
        }

        switch (sort) {
            case "az":
                result.sort((a,b) => a.title.localeCompare(b.title));
                break;
            
            case "za":
                result.sort((a,b) => b.title.localeCompare(a.title));
                break;

            case "status":
                result.sort((a,b) => b.status.localeCompare(a.status));
                break;

            case "platform":
                result.sort((a,b) => a.platform.localeCompare(b.platform));
                break;

            case "progress":
                result.sort((a,b) => b.progress - a.progress);
                break;

            case "recent":
                result.sort((a,b) => b.id - a.id);
                break;

            case "oldest":
                result.sort((a,b) => a.id - b.id);
                break;

            
            default:
                break;
        }
        
        setFilteredGames(result);
    }, [games, filter, sort])

    return {
        filter,
        setFilter,
        sort,
        setSort,
        filteredGames,
        setFilteredGames
    }
}

export default useFilterLogic;