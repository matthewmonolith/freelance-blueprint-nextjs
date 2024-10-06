import { fetchFavourite } from "@/utils/actions";
import { CardSignInButton } from "../form/Buttons";
// import { Button } from "../ui/button";
// import { FaHeart } from "react-icons/fa";
import FavouriteToggleForm from "./FavouriteToggleForm";
import { auth } from "@clerk/nextjs/server";

async function FavouriteToggleButton({ productId }: { productId: string }) {
  const { userId } = await auth()
  if (!userId) return <CardSignInButton />;
  const favouriteId = await fetchFavourite({ productId });
  return (
    <FavouriteToggleForm favouriteId={favouriteId} productId={productId} />
  );
}

export default FavouriteToggleButton;
