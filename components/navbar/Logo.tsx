import Link from "next/link";
import { Button } from "../ui/button";
import { LuCat } from "react-icons/lu";

function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href="/">
        <LuCat/>
      </Link>
    </Button>
  );
}

export default Logo;
