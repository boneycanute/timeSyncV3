import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
} from "@nextui-org/navbar";

import { ThemeSwitch } from "@/components/theme-switch";
import { UserProfile } from "./UserProfile";
import Link from "next/link";

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <ThemeSwitch />
        <div className="flex justify-end">
          <UserProfile />
        </div>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 " justify="end">
        <ThemeSwitch />
        <div className="flex justify-end">
          <UserProfile />
        </div>
      </NavbarContent>
    </NextUINavbar>
  );
};
