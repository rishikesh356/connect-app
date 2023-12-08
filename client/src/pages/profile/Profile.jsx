import "./profile.scss"
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

//we can use directly currenUser for profile details but it will only show details  of current user
//and not the profile we select
const Profile = () => {
  const [openUpdate, setopenUpdate] = useState(false)
  const {currentUser}=useContext(AuthContext);
  //we will get the userid from url as profile url is always associated with a profile id
  //as defined in the app method
  //our url contains domain(localhost:3000 in this case) /profile/userid
  //we can split it and third element will be our userId 
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );
  //we find out the followerdUserids fromm relationships table where followedUserid=current profile id
  const {isLoading:risLoading, data :relationshipData} = useQuery(["relationship"], () =>
    makeRequest.get("/relationships?followedUserid=" + userId).then((res) => {
      return res.data;
    })
  );
    // console.log(data)
    // console.log(currentUser.city)
    //console.log(relationshipData)

    const queryClient = useQueryClient();
    const mutation = useMutation((following)=>{
        //passing followedUserid(profile user id) as query in delete and req payload in post
        if(following) return makeRequest.delete("/relationships?followedUserid="+userId)
        return makeRequest.post("/relationships",{followedUserid:userId})

    }, {
        onSuccess: () => {
            //on successful post request refetching will be done
          // Invalidate and refetch
          queryClient.invalidateQueries(["relationship"])
        },
      })
    const handleFollow=()=>{
        //the handle click will work two ways if the relationships data of current profile includes
        //current user it will work as following(to unfollow) else work as post follow
       mutation.mutate(relationshipData.includes(currentUser.id))
    }
  return (
    <div className="profile">
      {isLoading?"Loading":
      <>
      <div className="images">
        <img
          src={"/upload/"+data.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={"/upload/"+data.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {/* our userId is a string but currentUser.id is a number so we have to parse 
            userId into number */}
            {/* if the list of followers contains current user then show following else given  option to follow */}
            {risLoading?"Loading": userId===currentUser.id?
            <button onClick={()=>setopenUpdate(true)}>update</button>:
            <button onClick={handleFollow}>
              {relationshipData.includes(currentUser.id)?
              "Following":"Follow"}
              </button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        {/* we need to see posts of only current profile page user */}
      <Posts userId={userId} />
      </div>
      </>}
      {/* passing setopenUpdate as prop as we have button in update section that will Update
      the openupdate state to false 
      we also pass the user data to let the update component access current users data*/}
      {openUpdate && <Update setopenUpdate={setopenUpdate} user={data}/>}
    </div>
  )
}

export default Profile