import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useToast = () => {
  const router = useRouter();

  const loginErrToast = () => {
    const handleCloseToast = (toastId: any) => toast.dismiss(toastId);

    const toastId = toast.error("Unauthorized", {
      description: (
        <>
          You are not logged in,{" "}
          <span
            onClick={() => {
              handleCloseToast(toastId);
              router.push("/sign-in");
            }}
            className="underline cursor-pointer"
          >
            do it now
          </span>
        </>
      ),
    });
  };

  return { loginErrToast };
};

export default useToast;
