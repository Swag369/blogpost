import { useEffect, useState } from 'react';
import NestedComment from './NestedComments';
import { postComment, getComments } from './CommentAPI';




export default function CommentSection({articleID}) {

    const [newCommentDB, setNewCommentDB] = useState(false)

    const [comments, setComments] = useState([])

    const [writer, setWriter] = useState("")
    const [newComment, setNewComment] = useState("")


    // get reply data
    useEffect(() => {
        let ignore = false;
        getComments(articleID).then(result => {
            if (ignore) {} //pass
            setComments(result)
        })
        setNewCommentDB(false)
        return () => {
            ignore = true;
        };
    }, [newCommentDB, articleID])


    //validate and either post or alert
    const postTopLevelReply = async () => {

        // a hack for input validation in this scenario
        if (newComment.length < 5 || writer === "") {
            const alertDiv = document.createElement('div');
            alertDiv.textContent = "Make sure your reply is longer than 5 characters and you've entered your name";
            alertDiv.style.position = 'fixed';
            alertDiv.style.bottom = '30px';
            alertDiv.style.right = '30px';
            alertDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            alertDiv.style.color = 'white';
            alertDiv.style.padding = '10px';
            alertDiv.style.borderRadius = '5px';
            document.body.appendChild(alertDiv);
            
            setTimeout(() => {
            alertDiv.style.display = 'none';
            }, 2000); // Hide after 2 seconds
            return
        }
    
        await postComment({parentID: -1, writer: writer, content: newComment, article_id: articleID})
        // negative parent ID was a cleanliness choice
        
        setNewCommentDB(true)
        setNewComment("")
        setWriter("")

    }

    return (
    <div className='flex flex-col items-start px-3 pt-5 w-10/12 border-t'>

       {/* Existing Comments */}

       <div className='flex w-full flex-col items-start px-3'>
            {comments.map((comment) => (<NestedComment articleID = {articleID} key = {comment.id} comment = {comment} setNewCommentDB = {setNewCommentDB} />))}
        </div>


        {/* New Comment Input */}

        <div className="flex flex-col gap-3 items-center justify-center mt-10 w-full">
            <input id = "newCommentWriter" value = {writer} className="w-3/4 border border-gray-200 p-2 rounded-md" placeholder="Your Name" onChange={(e) => setWriter(e.target.value)}/>
            <textarea id = "newComment" value = {newComment} className="w-3/4 border border-gray-200 p-2 rounded-md" placeholder="Write your reply" onChange={(e) => setNewComment(e.target.value)}/>
            <button
                className="w-3/4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                onClick={async () => await postTopLevelReply()}    
            >
                Post
            </button>
        </div>
    
    </ div>
    )
}