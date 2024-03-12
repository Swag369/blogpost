import CommentSection from "./comments/CommentSection.js"
import Navbar from "./navigation/Navbar.js"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Footer from "./navigation/Footer.js"
import { useEffect, useState } from "react"



// structured header, author-info, content, comments, footer
export default function Page() {

    const [articleID, setArticleID] = useState(1)
    const [writer, setWriter] = useState("No author found")
    const [markdownText, setMarkdownText] = useState("No article found")

    // get article data
    useEffect(() => {
        fetch("http://127.0.0.1:8000/articles/" + articleID).then(
            response => response.json()
        ).then(
            data => {
                setMarkdownText(data.content)
                setWriter(data.author)
            }
        )
    }, [articleID])

    return (
        <div className="flex flex-col items-center justify-center w-full font-serif">
            <Navbar setArticleID={setArticleID} />
            <div className="w-11/12 md:w-10/12 h-full flex flex-row justify-center items-center">
                <div className="lg:w-2/3 my-10">
                    <span className="flex flex-row justify-start">{"Authored By: "+writer}</span>
                    <span className="text-slate-300 flex flex-col items-start mb-7">{"Posted on: December 22, 2016"}</span>
                    <Markdown articleID = {articleID} className="prose flex flex-col items-start mb-7 border-l pl-6" remarkPlugins={[remarkGfm]}>{markdownText}</Markdown>
                </div>
                <div className="hidden md:visible w-1/12 bg-black h-screen text-white flex flex-col justify-around"><span>advert</span> <span>section</span></div>
            </div>
            <big className="w-10/12 flex flex-row justify-start items-start py-10">Comments</big>
            <CommentSection articleID = {articleID} />      
            <Footer />
        </div>
    )
}