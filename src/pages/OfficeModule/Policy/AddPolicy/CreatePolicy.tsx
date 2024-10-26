import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Loader, Paper, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreatePolicyMutation } from "../../../../features/api/policySlice";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ContextModalProps } from "@mantine/modals";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(1, { message: "Description is required" }),
});

type AddPolicy = z.infer<typeof schema>;
type AddPolicyProps = ContextModalProps<{ modalBody?: string }>;

const CreatePolicy = ({ context, id }: AddPolicyProps) => {
  const [createPolicy, { isLoading }] = useCreatePolicyMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddPolicy>({
    resolver: zodResolver(schema),
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    // content,
    onUpdate: ({ editor }) => {
      setValue("description", editor.getHTML());
    },
  });

  const onSubmit = async (data: AddPolicy) => {
    const obj = {
      name: data?.name,
      written_policy: data?.description,
    };
    try {
      const response = await createPolicy(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: "Policy Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      context.closeModal(id);
      console.log(response);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't create Policy",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };
  return (
    <Paper withBorder shadow="md" radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          {...register("name")}
          error={errors.name?.message as React.ReactNode}
        />
        <Box mt={20}>
          {editor && (
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          )}
        </Box>
        <Button
          type="submit"
          className="rounded-lg mt-6"
          bg="black"
          disabled={isLoading}
        >
          {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
        </Button>
      </form>
    </Paper>
  );
};

export default CreatePolicy;
