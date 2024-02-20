import { FC, HTMLAttributes } from "react";

interface MaxWidthWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const MaxWidthWrapper: FC<MaxWidthWrapperProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`container max-w-5xl mx-auto ${className}`} {...props}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
