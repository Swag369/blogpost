import { useEffect, useState } from 'react';
import NestedComment from './NestedComments';
import { postComment, getComments } from './CommentAPI';




export default function CommentSection() {

    const [newCommentDB, setNewCommentDB] = useState(false)

    const [comments, setComments] = useState([])

    const [writer, setWriter] = useState("")
    const [newComment, setNewComment] = useState("")


    // get reply data
    useEffect(() => {
        let ignore = false;
        getComments().then(result => {
            if (ignore) {} //pass
            setComments(result)
        })
        setNewCommentDB(false)
        return () => {
            ignore = true;
        };
    }, [newCommentDB])


    //validate and either post or alert
    const postTopLevelReply = () => {

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
    
        postComment({parentID: -1, writer: writer, content: newComment})
        // negative parent ID was a cleanliness choice
        
        setNewCommentDB(true)
        setNewComment("")
        setWriter("")

    }

    return (
    <>

       {/* Existing Comments */}

       <div className='flex flex-col items-start px-3'>
            {comments.map((comment) => (<NestedComment key = {comment.id} comment = {comment} setNewCommentDB = {setNewCommentDB} />))}
        </div>


        {/* New Comment Input */}

        <div className="flex flex-col gap-3 items-center justify-center mt-10">
            <textarea id = "newCommentWriter" value = {writer} className="w-1/4 border border-gray-200 p-1" placeholder="Your Name" onChange={(e) => setWriter(e.target.value)}/>
            <textarea id = "newComment" value = {newComment} className="w-3/4 border border-gray-200 p-1" placeholder="Write your reply" onChange={(e) => setNewComment(e.target.value)}/>
            <button
                className="w-1/2 items-center bg-primary text-white p-1"
                onClick={() => postTopLevelReply()}    
            >
                Post
            </button>
        </div>
    
    </ >
    )
}