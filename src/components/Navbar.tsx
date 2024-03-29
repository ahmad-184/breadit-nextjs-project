import Link from "next/link";

import Icons from "./Icons";
import UserNavDropdown from "./UserNavDropdown";
import SignInButton from "./SignInButton";
import MaxWidthWrapper from "./MaxWidthWrapper";
import NavbarWrapper from "./NavbarWrapper";
import { getUserSession } from "@/lib/nextauth-options";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const session = await getUserSession();

  return (
    <NavbarWrapper>
      <MaxWidthWrapper className="flex gap-3 items-center justify-between">
        {/* logo */}
        <Link href="/" className="block w-fit">
          <div className="flex items-center gap-2">
            <Icons.logo className="w-7 h-7 sm:w-8 sm:h-8 md:w-7 md:h-7" />
            <p className="text-zinc-500 text-md font-medium hidden md:block relative">
              Breadit
            </p>
          </div>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* sign in button */}
        {session?.user ? (
          <UserNavDropdown user={session.user} />
        ) : (
          <SignInButton />
        )}
      </MaxWidthWrapper>
    </NavbarWrapper>
  );
};

export default Navbar;
