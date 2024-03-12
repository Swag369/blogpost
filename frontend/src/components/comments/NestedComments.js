import { useState } from 'react';
import { postComment } from './CommentAPI';


// nested comments with reply functionality

export default function NestedComment({comment, setNewCommentDB}) {

    const [isCommenting, setIsCommenting] = useState(false)

    const [writer, setWriter] = useState("")
    const [commentDraft, setCommentDraft] = useState("")

    //validate and either post or alert
    const postNestedReply = (parentID) => {

        // a hack for input validation in this scenario
        if (commentDraft.length < 5 || writer === "") {

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

        postComment({parentID: parentID, writer: writer, content: commentDraft})
        setNewCommentDB(true)
        setCommentDraft("")
        setWriter("")
        setIsCommenting(false)
    }


    return (
        <div className='flex flex-col gap-2 my-2 border border-slate-200 pl-20 w-96'>

            {/* Comment Block */}
            <span>{comment.writer}</span>
            <span>{comment.content}</span>
 
            {/* Comment Reply Block */}
            <div>
                {isCommenting?
                    <div className='flex flex-col justify-center items-center'>
                        <button className="text-primary w-1/2" onClick={() => (setIsCommenting(!isCommenting))}>Cancel</button>
                        <div>
                            <textarea className="w-1/2 border border-gray-200 p-1" placeholder="Your Name" value = {writer} onChange={(e) => setWriter(e.target.value)}/>
                            <textarea className="w-full border border-gray-200 p-1" placeholder="Write your reply" value = {commentDraft} onChange={(e) => setCommentDraft(e.target.value)}/>
                            <button className="w-1/2 items-center bg-primary text-white p-1" onClick={() => postNestedReply(comment.id)}>Post</button>
                        </div>
                    </div>
                    
                    :
                    
                    <button className="text-primary w-1/2" onClick={() => (setIsCommenting(!isCommenting))}>Reply</button>
                }
            </div>

            {/* Nested Comments */}
            {comment.children.map((child) => (<NestedComment key = {child.id} comment = {child} setNewCommentDB = {setNewCommentDB} />))}

        </div>
    )
}