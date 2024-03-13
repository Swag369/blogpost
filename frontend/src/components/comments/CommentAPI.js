
const api_url = "http://127.0.0.1:8000/"
const api_key = "legit_hashed_stored_in_env_checked_against_in_DB_api_key" //add to hosting env




export async function postComment({parentID, writer, content, article_id}) {


    // if top level comment, set parentID null
    if (parentID <=0 ) {
        parentID = -1 // flag was too redundant
    }

    console.log(JSON.stringify({"writer": writer, "content": content, "parent_reply_id": parentID, "article_id": article_id}))

    try{
        console.log("done posting")
        let posting = await fetch(api_url + 'articles/' + article_id + "/new_reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": api_key            
            },
            body: JSON.stringify({"writer": writer, "content": content, "parent_reply_id": parentID})
        })
        return posting
    }
    catch (e) {
        console.log(e)
    }

}


export async function getComments(article_id) {

    console.log("starting fetching" + article_id)

    let ret = await fetch(api_url + 'articles/' + article_id + "/replies")

    ret = await ret.json()

    console.log(ret)

    return ret

}