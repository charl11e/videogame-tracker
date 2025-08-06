import {useState, useEffect} from 'react';

function useErrorBarLogic() {
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 10000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return [errorMessage, setErrorMessage];
} 

export default useErrorBarLogic;