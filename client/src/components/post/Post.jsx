import "./post.scss"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
const Post = ({ post }) => {
    const [menuopen, setmenuopen] = useState(false)
    const [commentOpen, setcommentOpen] = useState(false);
    const { currentUser } = useContext(AuthContext)
    const { isLoading, error, data } = useQuery(["likes", post.id], () =>
        //making request through axios instead of making separte function for each component
        makeRequest.get("/likes?postId=" + post.id).then((res) => {
            return res.data;
        })
    );
    const queryClient = useQueryClient();
    const mutation = useMutation((liked)=>{
        //passing postid as query in delete and req payload in post
        if(liked) return makeRequest.delete("/likes?postId="+post.id)
        return makeRequest.post("/likes",{postId:post.id})

    }, {
        onSuccess: () => {
            //on successful post request refetching will be done
          // Invalidate and refetch
          queryClient.invalidateQueries(["likes"])
        },
      })
    const deletePostmutation = useMutation((postId)=>{
        //passing postid as query in delete
          return makeRequest.delete("/posts/"+postId)

    }, {
        onSuccess: () => {
            //on successful post request refetching will be done
          // Invalidate and refetch
          queryClient.invalidateQueries(["posts"])
        },
      })
    const handleClick=(e)=>{
        //the handle click will work two ways if the likes data of current post includes
        //current user if will work as delete else work as post request
        e.preventDefault();
       mutation.mutate(data.includes(currentUser.id))
    }
    const handleDelete=(e)=>{
        e.preventDefault();
    deletePostmutation.mutate(post.id)
    }

    return (
        <div className="post">
            <div className="container">

                <div className="user">
                    <div className="userInfo">
                        <img src={"/upload/"+post.profilePic} alt="" />
                        <div className="details">
                            <Link
                                to={`/profile/${post.userId}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <span className="name">{post.name}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={()=>setmenuopen(!menuopen)}/>
                    {menuopen && post.userid===currentUser.id && <button onClick={handleDelete}>Delete</button>}
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    {/* our post image i going to be in upload folder so we modify the src url accordingly */}

                    <img src={"/upload/" + post.img} alt="" />
                </div>
                <div className="info">
                    <div className="item">
                        {/* if our current userid is included in data obtained from likes table then show red
                      else no color  also we are fetching only user id from the data */}

                        {isLoading ? "Loading" : 
                        data.includes(currentUser.id) ? 
                        <FavoriteOutlinedIcon style={{ color: 'red' }} onClick={handleClick} /> 
                        : <FavoriteBorderOutlinedIcon onClick={handleClick} />}
                        {/* length of data is our no of likes */}
                        {data?.length} likes
                    </div>
                    <div className="item" onClick={() => (setcommentOpen(!commentOpen))}>
                        <TextsmsOutlinedIcon />
                        12 comments
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {commentOpen && <Comments postId={post.id} />}
            </div>
        </div>
    )
}

export default Post