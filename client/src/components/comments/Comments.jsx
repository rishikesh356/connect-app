import { useContext } from "react";
import "./comments.scss"
import {AuthContext} from "../../context/authContext"
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
const Comments = ({postId}) => {
  const [menuOpen, setmenuOpen] = useState(false)
    const [desc, setdesc] = useState("")
    const {currentUser}=useContext(AuthContext)
    const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );
  console.log(data)
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  
    const deletemutation = useMutation((commentId)=>{
      console.log(commentId)
        return makeRequest.delete("/comments?id="+commentId)

    }, {
        onSuccess: () => {
            //on successful post request refetching will be done
          // Invalidate and refetch
          queryClient.invalidateQueries(["comments"])
        },
      })
      //passing the inputs that is desc and postId through mutate
      const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({ desc, postId });
        setdesc("");
      };
    
  return (
    <div className="comments">
        <div className="write">
            <img src={"/upload/"+currentUser.profilePic} alt="" />
            <input type="text" placeholder="write a comment" onChange={(e)=>setdesc(e.target.value)} value={desc}/>
            <button onClick={handleClick}>send</button>
        </div>
        {error ?"Something went wrong":(isLoading? 
           "loading":
            data.map((comment)=>(
                <div className="comment" key={comment.id}>
                    <img src={"/upload/"+comment.profilePic} alt="" />
                    <div className="info">
                        <span>{comment.name}</span>
                        <p>{comment.desc}</p>
                    </div>
                    <span className="date">{moment(comment.createdAt).fromNow()}</span>
                    <MoreHorizIcon onClick={()=>setmenuOpen(!menuOpen)}/>
                    {menuOpen && comment.userid===currentUser.id &&
                    <button onClick={(e)=>{
                      e.preventDefault()
                      deletemutation.mutate(comment.id);
                    }}>delete</button>}
                </div>
            )))
        }
    </div>
  )
}

export default Comments