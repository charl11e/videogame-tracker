function Footer() {
    return (
        <footer className="w-full bg-gray-800 text-gray-100 py-4 mt-8 rounded">
            <div className="container mx-auto flex flex-col items-center gap-2">
                <span className="text-lg font-semibold">Made by Charlie Livesey-Shorrock</span>

                <div className="flex gap-4 text-sm">
                    <a href="https://github.com/charl11e" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                        <img src="./icons/github.svg" alt="GitHub" className="w-8 h-8"></img>
                    </a>
                </div>

                <a href="https://www.svgrepo.com" target="_blank" rel="noreferrer" className="text-sm hover:underline">
                Icons provided by SVGRepo
                </a>

                <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="text-sm hover:underline">
                Styled using TailwindCSS
                </a>

            </div>
        </footer>
    );
}

export default Footer;