import { useState, useRef, useEffect } from 'react';

function FilterButton({
    filter,
    setFilter,
    sort,
    setSort

}) {

    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function checkboxToggle(status) {
        if (filter.includes(status)) {
            setFilter(filter.filter(e => e !== status));
        } else {
            setFilter([...filter, status]);
        }
    }

    return (

        <div>
            <div className="relative inline-block" ref={dropdownRef}>
                <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                onClick={() => setOpen(!isOpen)}>
                    <img src="/icons/filter.svg" alt="Filter" title="Filter" className="w-5 h-5"></img>
                </button>

                {isOpen && (
                    <div className="absolute top-12 right-0 bg-white border rounded-md shadow-md break-normal w-64 flex flex-col p-2 z-50">
                        <h1 className="font-bold text-center">Show</h1>
                        
                        <div className="flex justify-between items-center my-2">
                            <label htmlFor="FINISHED">Finished games</label> 
                            <input type="checkbox" id="FINISHED" name="FINISHED" checked={filter.includes("FINISHED")} onChange={() => checkboxToggle("FINISHED")}></input>
                        </div>

                        <div className="flex justify-between items-center my-2">
                            <label htmlFor="IN_PROGRESS">In progress games</label>
                            <input type="checkbox" id="IN_PROGRESS" name="IN_PROGRESS" checked={filter.includes("IN_PROGRESS")} onChange={() => checkboxToggle("IN_PROGRESS")}></input>         
                        </div>

                        <div className="flex justify-between items-center my-2">
                            <label htmlFor="BACKLOG">Backlog games</label>
                            <input type="checkbox" id="BACKLOG" name="BACKLOG" checked={filter.includes("BACKLOG")} onChange={() => checkboxToggle("BACKLOG")}></input>         
                        </div>  

                        <div className="flex justify-between items-center my-2">
                            <label htmlFor="ABANDONED">Abandoned games</label>
                            <input type="checkbox" id="ABANDONED" name="ABANDONED" checked={filter.includes("ABANDONED")} onChange={() => checkboxToggle("ABANDONED")}></input>         
                        </div>

                        <h1 className="font-bold text-center">Sort By</h1>
                        
                        <select id="sort" value={sort} className="block rounded-md shadow-sm w-full px-3 py-2 border border-gray-300 text-lg focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => {
                            setSort(e.target.value);
                        }}>
                            <option value="az">Alphabetical (a-z)</option>
                            <option value="za">Alphabetical (z-a)</option>
                            <option value="status">Status</option>
                            <option value="platform">Platform</option>
                            <option value="progress">Completion</option>
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Least Recent</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FilterButton;