import { Session } from "@supabase/supabase-js";
import { ArrowRight, MoonIcon, SunIcon, Trash, Undo, Code2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";

export const NavBar = ({
  session,
  showLogin,
  signOut,
  onClear,
  canClear,
  onSocialClick,
  onUndo,
  canUndo
}: {
  session: Session | null;
  showLogin: () => void;
  signOut: () => void;
  onClear: () => void;
  canClear: boolean;
  onSocialClick: (target: "github" | "x" | "discord") => void;
  onUndo: () => void;
  canUndo: boolean;
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full flex bg-background py-4">
      <div className="flex flex-1 items-center">
        <Link href={"/"} className="flex items-center gap-2">
          <Code2Icon className="w-6 h-6 dark:text-white" />
        </Link>
        <h1 className="ml-2 whitespace-pre">AI Code</h1>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"} onClick={onUndo} disabled={!canUndo}>
                <Undo className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>撤消</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"} onClick={onClear} disabled={!canClear}>
                <Trash className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>清空聊天</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                disabled={false}
              >
                {theme === "light" ? (
                  <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>切换主题</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {session ? (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          session.user.user_metadata?.avatar_url ||
                          "https://avatar.vercel.sh/" + session.user.email
                        }
                        alt={session.user.email}
                      />
                    </Avatar>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>我的账号</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenu>
        ) : (
          <Button variant={"default"} onClick={showLogin}>
            登录 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </nav>
  );
};
