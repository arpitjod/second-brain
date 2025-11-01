import {Tweet} from "../icons/twitter.tsx"
import {Yt} from "../icons/yt.tsx"

export function SideBarItem({text,icon}:{
    text:string;
    icon:any;
}){
    return <div className="cursor-pointer hover:bg-gray-200 rounded max-w-48 transition-all duration-150 flex px-2 justify-center items-center gap-2">
            {icon}{text}
        </div>
}