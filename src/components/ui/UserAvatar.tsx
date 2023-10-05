import { FC } from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarProps } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Icons } from "../Icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative h-full w-full aspect-square">
            <Image src={user.image} width={30} height={30} alt="profile picture" referrerPolicy="no-referrer"/>
        </div>
      ) : (
        <AvatarFallback>
            <span className="sr-only">{user?.name}</span>
            <Icons.user className = 'h-4 w-4' />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
