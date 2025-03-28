import { LuUser } from "react-icons/lu";
import { currentUser } from "@clerk/nextjs/server";

async function UserIcon() {

  const user = await currentUser();
  const profileImage = user?.imageUrl;

  if(profileImage){
    return <img data-test='user-icon' src={profileImage} alt="profile picture" className="w-6 h-6 rounded-full object-cover"/>
  }

  return <LuUser className="w-6 h-6 bg-primary rounded-full text-white"/>
}

export default UserIcon;
