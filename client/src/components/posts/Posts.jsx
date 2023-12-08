import { useQuery } from "react-query";
import Post from "../post/Post";
import "./posts.scss"
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  
    const { isLoading, error, data } = useQuery(["posts"], () =>
    //making request through axios instead of making separte function for each component
    makeRequest.get("/posts?userId="+userId).then((res) => {
      return res.data;
    })
  );

  //console.log(data)
  
  return (
    <div className="posts">
        {error?"Something went wrong...":(isLoading ? "Loading...":
            data.map(post=>(
                <Post post={post} key={post.id}/>
            )))
        }
    </div>
  )
}

export default Posts