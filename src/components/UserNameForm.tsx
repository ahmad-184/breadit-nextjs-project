"use client";

import {
  updateUsernamesValidator,
  updateUsernamesValidatorType,
} from "@/lib/validators";
import { Input } from "./ui/Input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import useToast from "@/hooks/use-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";

type UserNameFormTyps = {
  username: string;
};

const UserNameForm = ({ username }: UserNameFormTyps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(updateUsernamesValidator),
    defaultValues: {
      username,
    },
  });

  const router = useRouter();

  const { loginErrToast } = useToast();

  const { mutate: updateUserName } = useMutation({
    mutationFn: async (data: updateUsernamesValidatorType) => {
      const payload: updateUsernamesValidatorType = data;

      if (payload.username === username) throw new Error("SAME_USERNAME");

      const { status } = await axios.post(
        "/api/settings/update-username",
        payload
      );

      if (status !== 200) throw new Error();

      return true;
    },
    onError: (err: Error) => {
      // if its request error
      // Unauthorized error
      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      if (err instanceof axios.AxiosError && err.response?.status === 409)
        return toast.error("Error", {
          description: "This user name already taken",
        });

      if (err.message === "SAME_USERNAME")
        return setError("username", { message: "Username cannot be same" });

      // if we dont no what the hell error is
      return toast.error("Error", {
        description: "Something went wrong, please try again",
      });
    },
    onSuccess: () => {
      toast.success("Your username updated");
      router.refresh();
    },
  });

  const onSubmit = (data: updateUsernamesValidatorType) => {
    updateUserName(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <div className="relative h-fit">
          <span className="text-sm text-zinc-400 absolute top-1/2 -translate-y-1/2 pl-2">
            u/
          </span>
          <Input
            {...register("username")}
            defaultValue={username}
            className="pl-6"
          />
        </div>
        {errors.username ? (
          <p className="text-xs text-red-500 mt-1">
            {errors.username?.message}
          </p>
        ) : null}
      </div>

      <div className="flex w-full">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default UserNameForm;
