"use client";
import { useWindowScroll } from "@mantine/hooks";

import { cn } from "@/lib/utils";

interface NavbarWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const NavbarWrapper = ({
  className,
  children,
  ...props
}: NavbarWrapperProps) => {
  const [scroll] = useWindowScroll();

  return (
    <div
      className={cn(
        `fixed top-0 z-50 inset-x-0 bg-zinc-50 sm:px-4 py-3 border-b border-zinc-300 ${className}`,
        {
          "bg-white/50 backdrop-blur-md": scroll.y >= 5,
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default NavbarWrapper;
