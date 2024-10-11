"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "@/utils/links";
import { UserIcon } from "lucide-react";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignUpButton,
  ClerkProvider,
} from "@clerk/nextjs";
import SignOutLink from "./SignOutLink";
import { useAuth } from "@clerk/nextjs";

function LinksDropdown() {
  const { userId } = useAuth();
  const isAdmin = userId === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

  return (
    <ClerkProvider dynamic>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-4 max-w-[100px]">
            <LuAlignLeft className="w-6 h-6" />
            <UserIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start" sideOffset={10}>
          <SignedOut>
            <DropdownMenuItem>
              <SignInButton mode="modal">
                <button className="w-full text-left">Login</button>
              </SignInButton>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignUpButton mode="modal">
                <button className="w-full text-left">Register</button>
              </SignUpButton>
            </DropdownMenuItem>
          </SignedOut>
          <SignedIn>
            {links.map((link) => {
              if (link.label === "dashboard" && !isAdmin) return null;
              return (
                <DropdownMenuItem key={link.href}>
                  <Link href={link.href} className="capitalize w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutLink />
            </DropdownMenuItem>
          </SignedIn>
        </DropdownMenuContent>
      </DropdownMenu>
    </ClerkProvider>
  );
}

export default LinksDropdown;
