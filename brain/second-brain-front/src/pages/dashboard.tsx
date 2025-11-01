import {useState} from "react"
import {Button} from "../components/Button"
import {PlusIcon} from "../icons/PlusIcon"
import {ShareIcon} from "../icons/ShareIcon"
import {Card} from "../components/Card.tsx"
import {CreateContentModal} from "../components/CreateContentModal.tsx"
import {SideBar} from "../components/Sidebar" 
import {useContent} from "../hooks/useContent" 
import axios from "axios";
import { BACKEND_URL } from "../config";

export function Dashboard() {
  const[modalOpen,setModalOpen]=useState(false)
  const contents=useContent();
  return <div>
    <SideBar/>
    <div className="p-7 ml-58 min-h-screen bg-gray-100 border-0.2 br-md">
      <CreateContentModal open={modalOpen} onClose={()=>{
        setModalOpen(false)
      }} />
      <div className="flex justify-end gap-4 ">
        <Button onClick={()=>{
          setModalOpen(true)
        }} variant="primary" text="Add Content" startIcon={<PlusIcon/>}></Button>
        <Button onClick={async()=>{
          const response=await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
            share:true
          });
          const shareURL=`https://localhost:5180/share/${response.data.hash}`
          alert(shareURL); 
        }}
        variant="secondary" text="Share Brain" startIcon={<ShareIcon/>}></Button>
      </div>
      <div className="flex gap-4 items-start">
        {contents.map(({type,link,title})=> <Card 
        type={type} 
        link={link}
        title={title} 
        />)}
      </div>
    </div>
  </div>
}

export default Dashboard



