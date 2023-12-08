import { useMutation, useQueryClient } from "react-query"
import { makeRequest } from "../../axios"
import "./update.scss"
import { useState } from "react"

const Update = ({setopenUpdate,user}) => {
    const [cover, setcover] = useState(null)
    const [profile, setprofile] = useState(null)
    const [texts, settexts] = useState({
        name:"",
        city:"",
        website:"",
    })
    const upload=async(file)=>{
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
    const handleChange=(e)=>{
        settexts(prev=>({
            ...prev,//prev value is used so all fields except the current do not change
            [e.target.name]:e.target.value
        }
        ))
    }
    const queryClient = useQueryClient();
    const mutation = useMutation((user)=>{
        return makeRequest.put("/users",user)

    }, {
        onSuccess: () => {
            //on successful post request refetching will be done
          // Invalidate and refetch
          queryClient.invalidateQueries(["user"])
        },
      })
      //passing the inputs that is desc image through mutate
    const handleSubmit= async(e)=>{
        e.preventDefault()
        let coverUrl;
        let profileUrl;
        coverUrl=cover ? await upload(cover):user.coverPic
        profileUrl=profile ?await upload(profile):user.profilePic
        mutation.mutate({...texts,coverPic:coverUrl,profilePic:profileUrl});
        setopenUpdate(false)
    }
  return (
    <div className="update">
        Update
        <form>
            <input type="file" onChange={(e)=>setcover(e.target.files[0])}/>
            <input type="file" onChange={(e)=>setprofile(e.target.files[0])}/>
            <input type="text" name="name" onChange={handleChange}/>
            <input type="text" name="city" onChange={handleChange}/>
            <input type="text" name="website" onChange={handleChange} />\
            <button onClick={handleSubmit}>Update</button>
        </form>
        <button onClick={()=>setopenUpdate(false)}>X</button>
    </div>
  )
}

export default Update