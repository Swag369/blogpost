import { useState } from 'react';
import { postComment } from './CommentAPI';


// nested comments with reply functionality

export default function NestedComment({comment, setNewCommentDB, articleID}) {

    const [isCommenting, setIsCommenting] = useState(false)

    const [writer, setWriter] = useState("")
    const [commentDraft, setCommentDraft] = useState("")

    //validate input and either post or alert
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

        postComment({parentID: parentID, writer: writer, content: commentDraft, article_id: articleID})
        setNewCommentDB(true)
        setCommentDraft("")
        setWriter("")
        setIsCommenting(false)
    }


    return (
        <div className='w-full flex flex-col gap-2 my-2 border-l border-t border-gray-200 p-2 pl-10 rounded-md'>

            {/* Comment Block */}
            <span className='w-full flex flex-row justify-between my-3'>
                <div> {comment.writer + ": " + comment.content} </div>
                {!isCommenting?
                    <button className="text-blue-500 w-1/2" onClick={() => (setIsCommenting(!isCommenting))}>Reply</button> 
                    :
                    <button className="text-blue-500 w-1/2" onClick={() => (setIsCommenting(!isCommenting))}>Cancel</button>}
                </span>
 
            {/* Comment Reply Block */}
                {isCommenting?
                    <div className='flex flex-row gap-3'>
                        <div>
                            <input className="w-full border border-gray-200 p-2 rounded-md" placeholder="Your Name" value={writer} onChange={(e) => setWriter(e.target.value)}/>
                            <textarea className="w-full border border-gray-200 p-2 rounded-md" placeholder="Write your reply" value = {commentDraft} onChange={(e) => setCommentDraft(e.target.value)}/>
                            <button className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" onClick={() => postNestedReply(comment.id)}>Post</button>
                        </div>
                    </div>
                    
                    :
                    
                    <div></div> 
                }

            {/* Nested Comments */}
            {comment.children.map((child) => (<NestedComment articleID = {articleID} key = {child.id} comment = {child} setNewCommentDB = {setNewCommentDB} />))}

        </div>
    )
}