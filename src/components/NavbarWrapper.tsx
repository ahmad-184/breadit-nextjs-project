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
        `fixed top-0 z-50 inset-x-0 sm:px-4 py-3 border-b border-zinc-200 ${className}`,
        {
          "bg-white/50 backdrop-blur-md": scroll.y >= 5,
          "bg-zinc-100": scroll.y === 0,
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default NavbarWrapper;
