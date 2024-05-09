import { BentoCard, BentoGrid } from "@/components/shared/bento-grid";
import Marquee from "@/components/shared/marquee";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
    CalendarIcon,
    DashboardIcon,
    FileTextIcon,
    PersonIcon
} from "@radix-ui/react-icons";
import { ScrollArea, Text } from "@radix-ui/themes";
import { Inbox } from "lucide-react";
import BentoTaskBoard from "../projects/board/bento-task-board";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const PROJECTS = [
    {
        name: "lotus",
        body: "Lotus is a challenge platform.",
    },
    {
        name: "personal website",
        body: "A personal website is a website that is created and maintained by a single person.",
    },
    {
        name: "zen",
        body: "Zen is a project management system that helps you organize and track all your projects in one place.",
    },
    {
        name: "asol",
        body: "Asol is a chatbot who uses openAI to answer questions.",
    },
    {
        name: "morch",
        body: "AI based emoji generator. Built with NextJS.",
    },
    {
        name: "course",
        body: "A course platform for adding and sharing courses. Built with NextJS and Supabase.",
    }
];

const USERS = [
    {
        name: "John Doe",
        email: "johndoe@example.com",
        role: "owner",
    },
    {
        name: "Jane Doe",
        email: "janedoe@example.com",
        role: "member",
    },
    {
        name: "Bob Smith",
        email: "bobsmith@example.com",
        role: "member",
    },
];

const features = [
    {
        Icon: FileTextIcon,
        name: "Build your projects",
        description: "Zen is a project management system that helps you organize and track all your projects in one place.",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Marquee
                pauseOnHover
                className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
            >
                {PROJECTS.map((p, idx) => (
                    <figure
                        key={idx}
                        className={cn(
                            "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                            "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
                        )}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex flex-col">
                                <figcaption className="text-sm font-medium dark:text-white ">
                                    {p.name}
                                </figcaption>
                            </div>
                        </div>
                        <blockquote className="mt-2 text-xs">{p.body}</blockquote>
                    </figure>
                ))}
            </Marquee>
        ),
    },
    {
        Icon: PersonIcon,
        name: "Invite people",
        description: "Invite people to your project by sharing a invite code.",
        className: "col-span-3 lg:col-span-2",
        background: (
            <Card
                className="absolute right-10 top-10 w-[70%] origin-top translate-x-0 border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10">
                <CardHeader>
                    <CardTitle>
                        Invite people
                    </CardTitle>
                    <CardDescription>
                        Invite people to your project by sharing a invite code.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="members">
                        <TabsList
                            className={
                                "flex w-full max-w-screen-sm items-center justify-center"
                            }
                        >
                            <TabsTrigger className={"w-full"} value="members">
                                Members
                            </TabsTrigger>
                            <TabsTrigger className={"w-full"} value="pendingInvites">
                                Pending Invites
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={"members"} className="overflow-hidden">
                            <ScrollArea
                                type="always"
                                scrollbars="vertical"
                                style={{ height: '100%' }}                >
                                <div className="text-sm text-zinc-400">
                                    <ul className="h-[200px] w-full list-inside list-disc pr-2">
                                        {USERS.map((user, idx) => (
                                            <li
                                                className="flex flex-row items-center justify-between p-3 text-sm text-zinc-500"
                                                key={user.email}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className={"text-zinc-400"}>
                                                        {user.name}
                                                    </span>
                                                    <span className={"text-zinc-500"}>
                                                        {user.email}
                                                    </span>
                                                </div>
                                                <button>
                                                    x
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="pendingInvites" style={{ height: '200px' }}>
                            <div className="my-4 flex w-full flex-col items-center justify-center space-y-2">
                                <Inbox className="mx-auto h-8 w-8 text-zinc-400" />
                                <Text>No pending invites found.</Text>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        )
    },
    {
        Icon: DashboardIcon,
        name: "Tasks",
        className: "col-span-3 lg:col-span-2",
        background: (
            <Card
                className="absolute right-10 top-10 w-[80%] origin-top translate-x-0 border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10">
                <CardHeader>
                    <CardTitle>
                        Tasks
                    </CardTitle>
                    <CardDescription>
                        Manage your tasks by adding, editing, and deleting them.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BentoTaskBoard />
                </CardContent>
            </Card>
        )
    },
    {
        Icon: CalendarIcon,
        name: "Plan",
        description: "Use the calendar to plan your projects by selecting a start and end date.",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Calendar
                mode="single"
                selected={new Date(2022, 4, 11, 0, 0, 0)}
                className="absolute border-zinc-800 right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
            />
        ),
    },

];

export function FeatureList() {
    return (
        <section className="relative w-full max-w-7xl mx-auto sm:py-32 md:py-52 lg:py-64">
                <BentoGrid>
                    {features.map((feature, idx) => (
                        <BentoCard key={idx} {...feature} />
                    ))}
                </BentoGrid>
        </section>
    );
}
