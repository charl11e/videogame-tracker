function ErrorBar({
    errorMessage
}) {
    return (
        <div className="w-full z-[9999]">
            {errorMessage && (
            <div className="bg-red-500 text-white p-2 text-center font-bold w-full rounded">
                <h1>ERROR: {errorMessage}</h1>
            </div>
            )}
        </div>
    )
}

export default ErrorBar;