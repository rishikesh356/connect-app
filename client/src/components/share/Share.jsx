import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";
import {
    useMutation,
    useQueryClient,
} from 'react-query'
import { makeRequest } from "../../axios";
const Share = () => {
    const [file, setfile] = useState(null)
    const [desc, setdesc] = useState("")
 
    //we create an upload function to upload the files in our upload folder
    const upload=async()=>{
        try {
            //using form data and our image uploaded input component has id "file"
            //so we use it to append in our state file
            const formData=new FormData();
            formData.append("file",file)
            const res=await makeRequest.post("/upload",formData);
            return res.data;
        } catch (error) {
            console.log(error)
        }
    }
    //we are using mutation as when ever we hit the post request in 'url/posts' and there is a
    // successful change in 'posts' query which we named for fetching posts using react query
    //refetching(get request from posts end point for posts table) will be done and posts will get updated
    const queryClient = useQueryClient();
    const mutation = useMutation((newPost)=>{
        return makeRequest.post("/posts",newPost)

    }, {
        onSuccess: () => {
            //on successful post request refetching will be done
          // Invalidate and refetch
          queryClient.invalidateQueries(["posts"])
        },
      })
      //passing the inputs that is desc image through mutate
    const handleChange= async(e)=>{
        e.preventDefault()
        let imgurl=""
        if(file) imgurl=await upload();
        mutation.mutate({desc,img:imgurl});
        setdesc("")
        setfile(null)
    }
  const {currentUser} = useContext(AuthContext)
  return (
    <div className="share">
      <div className="container">
        <div className="top">
        <div className="left">

          <img
            src={"/upload/"+currentUser.profilePic}
            alt=""
            />
          <input type="text" placeholder={`What's on your mind ${currentUser.name}?`} onChange={(e)=>{
              setdesc(e.target.value)
            }} value={desc}/>
        </div>
        <div className="right">
            {/* creating a dummy url for our file stored in upload folder to show it in small on the right before
            uploading*/}
            {file && <img className="file" alt="" src={URL.createObjectURL(file)}/>}
        </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={(e)=>{
                setfile(e.target.files[0])
            } } />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleChange}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
