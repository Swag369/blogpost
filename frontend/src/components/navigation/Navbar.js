import icon from '../../logo512.png'


// Header and Navigation Bar
export default function Navbar({setArticleID}) {

    const helper = a => {
        // console.log("set "+a)
        setArticleID(a)
    }

    return(
    <div className="flex flex-col items-center w-full static mb-5 sticky top-0">
        <div className="px-10 h-[90px] bg-gray-200 w-full flex flex-row drop-shadow-lg justify-between items-center font-sans font-semibold">
            <img src={icon} alt="icon" className="h-12 w-12" />
            <big>Articles</big>
            <img src={icon} alt="icon" className="h-12 w-12" />
        </div>
        <div className="bg-black w-full flex flex-col items-center justify-center">
            <div className="flex flex-row justify-around w-3/4 py-2 items-center text-white">
                <button className="px-2">Health</button>
                <button className="px-2" onClick={() => (helper(1))}>Politics</button>
                <button className="px-2" onClick={() => (helper(2))}>Education</button>
                <button className="px-2" onClick={() => (helper(3))}>Finance</button>
                <button className="px-2" onClick={() => (helper(4))}>Sports</button>
            </div>
        </div>
    </div>
    )
}