import { HTMLAttributes } from "react";
import Icons from "./Icons";

type ErrorAlertProps = HTMLAttributes<HTMLDivElement> & {
  text: string;
};

const ErrorAlert = ({ text, className, ...props }: ErrorAlertProps) => {
  return (
    <div
      {...props}
      className={`flex items-center px-4 py-3 w-full border gap-3 bg-red-100 border-red-600 rounded-md ${className}`}
    >
      <Icons.alert className="h-4 w-4 text-red-600 relative" />
      <p className="text-sm font-medium text-red-600">{text}</p>
    </div>
  );
};

export default ErrorAlert;
