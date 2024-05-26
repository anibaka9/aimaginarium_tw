/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/uLSJCc9AcbM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { createRoom } from "@/firebase/actions/create-room";

type Inputs = {
  nickname: string;
};

export function CreateRoom() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const roomId = await createRoom(data.nickname);
    navigate({ to: `/room/$roomId`, params: { roomId } });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create a Game Room</CardTitle>
            <CardDescription>
              Enter your nickname to create a game room
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                {...register("nickname")}
                id="nickname"
                placeholder="Enter your nickname"
              />

              {errors.nickname && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  This field is required.
                </p>
              )}
            </div>
            <Button className="w-full">Create</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}