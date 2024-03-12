import React, { useState, useEffect } from 'react';


const api_url = "http://127.0.0.1:8000/"
const api_key = "" //add to hosting env
let article_id = 1




// #I'm calling DB because
export async function postComment({parentID, writer, content}) {

    // if top level comment, set parentID null
    if (parentID <=0 ) {
        parentID = -1
    }

    console.log(JSON.stringify({"writer": writer, "content": content, "parent_reply_id": parentID}))

    return await fetch(api_url + 'articles/' + article_id + "/new_reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"            
        },
        body: JSON.stringify({"writer": writer, "content": content, "parent_reply_id": parentID})
    })

}


export async function getComments() {

    let ret = await fetch(api_url + 'articles/' + article_id + "/replies")

    ret = await ret.json()

    return ret

}