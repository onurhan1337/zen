import {AlertDialog, Button, Flex, Tooltip} from '@radix-ui/themes'
import {X} from 'lucide-react'
import {toast} from "sonner";
import {useRouter} from "next/router";

export default function DisconnectFromProject({userId, projectId}: { userId: string, projectId: string }) {
    const router = useRouter();

    const onSubmit = async () => {
        const res = await fetch(`/api/project/${projectId}/disconnect`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                projectId
            })
        });

        if (res.ok) {
            // send the user to the dashboard and show a success toast
            await router.push("/projects");
            toast.success("Successfully disconnected from the project");
        } else {
            const data = await res.json();
            toast.error(data.error);
        }
    }

    return (
        <AlertDialog.Root>
            <Tooltip content={"Disconnect from project"}>
                <AlertDialog.Trigger>
                    <Button color="red" variant={'soft'}>
                        <X />
                    </Button>
                </AlertDialog.Trigger>
            </Tooltip>
            <AlertDialog.Content style={{maxWidth: 450}}>
                <AlertDialog.Title>
                    Disconnect from project
                </AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure you want to disconnect from this project? You will lose access to all the project and tasks.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" radius={'full'}>
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button onClick={() => onSubmit()} variant="solid" color="red" radius={'full'}>
                            Disconnect
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}