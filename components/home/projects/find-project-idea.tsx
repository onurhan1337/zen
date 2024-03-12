import {
  Avatar,
  Box,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useChat } from "ai/react";
import Markdown from "react-markdown";

import Sparkles from "@/components/shared/icons/sparkles";

export default function FindProjectIdea({
  isOpen,
  onClose,
  userAvatar,
}: {
  isOpen: boolean;
  onClose: () => void;
  userAvatar: string;
}) {
  const { messages, handleSubmit, input, handleInputChange } = useChat();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <Dialog.Content style={{ maxWidth: 450, overflow: "hidden" }}>
        <Dialog.Title>Find a project idea</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Get a project idea based on your skills and interests with the help of
          AI.
        </Dialog.Description>

        <Box
          my={"4"}
          style={{
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {messages.map((message, i) => (
            <Box key={i} className="'w-full mb-2 rounded-lg bg-zinc-800/20 p-2">
              <Flex justify={"start"} gap="2">
                <Flex direction="column" gap="3" p="2">
                  <Avatar
                    src={message.role === "user" ? userAvatar : ""}
                    fallback={message.role === "user" ? "YOU" : "AI"}
                    alt={"User Avatar"}
                    size={"1"}
                    radius={"full"}
                  />

                  <Markdown>{message.content}</Markdown>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Box>

        <Flex direction="column" gap="3">
          <form method="post" className={"w-full"} onSubmit={handleSubmit}>
            <TextField.Root>
              <TextField.Input
                size={"2"}
                id={"input"}
                name="prompt"
                value={input}
                width={"100%"}
                color={"purple"}
                onChange={handleInputChange}
                placeholder={'e.g. "Machine Learning"'}
              />
              <TextField.Slot>
                <IconButton
                  size="2"
                  type="submit"
                  radius="full"
                  variant="ghost"
                  color={"purple"}
                >
                  <Sparkles className={"h-4 w-4 text-purple-100"} />
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
          </form>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
