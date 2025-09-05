import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Paper,
  Text,
  TextInput,
  Group,
  LoadingOverlay,
} from "@mantine/core";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreatePolicyMutation } from "../../../../features/api/policySlice";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";
import { ContextModalProps } from "@mantine/modals";

// Enhanced validation schema
const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Policy name must be at least 2 characters" })
    .max(100, { message: "Policy name cannot exceed 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, {
      message:
        "Policy name can only contain letters, numbers, spaces, hyphens, and underscores",
    }),
  description: z
    .string()
    .min(1, { message: "Policy content is required" })
    .refine(
      (html) => {
        // Create a temporary element to parse HTML
        const div = document.createElement("div");
        div.innerHTML = html;

        // Get text content and strip whitespace
        const text = div.textContent || div.innerText || "";
        return text.trim().length > 0;
      },
      { message: "Policy content cannot be empty" }
    ),
});

type AddPolicy = z.infer<typeof schema>;
type AddPolicyProps = ContextModalProps<{ modalBody?: string }>;

const CreatePolicy = ({ context, id }: AddPolicyProps) => {
  const [createPolicy, { isLoading, error }] = useCreatePolicyMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddPolicy>({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on change for better UX
  });

  const descriptionValue = watch("description", "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        validate: (url) => /^https?:\/\//.test(url),
      }),
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: descriptionValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("description", html, { shouldValidate: true });
    },
    immediatelyRender: false,
  });

  console.log(isLoading, error, "isLoading, error");

  // Sync editor content with form value
  useEffect(() => {
    if (editor && descriptionValue !== editor.getHTML()) {
      editor.commands.setContent(descriptionValue);
    }
  }, [descriptionValue, editor]);

  function sanitizeHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;

    // remove empty tags
    div.querySelectorAll("*").forEach((el) => {
      if (!el.textContent?.trim()) {
        el.remove();
      }
    });

    return div.innerHTML.trim().replace(/\s+/g, " ");
  }

  const onSubmit = async (data: AddPolicy) => {
    try {
      // Strip excessive whitespace and empty tags from HTML
      const cleanHtml = sanitizeHtml(data.description);

      const obj = {
        name: (data.name ?? "").trim(),
        written_policy: cleanHtml,
      };

      const response = await createPolicy(obj).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: "Policy created successfully",
        icon: <IconCheck size={16} />,
        color: "green",
        autoClose: 3000,
      });

      context.closeModal(id);
      reset();
    } catch (err) {
      console.error("Policy creation error:", err);
      notifications.show({
        title: "Error!",
        message: "Failed to create policy. Please try again.",
        icon: <IconX size={16} />,
        color: "red",
        autoClose: 5000,
      });
    }
  };

  const handleClose = () => {
    if (isDirty) {
      // Confirm before closing if there are unsaved changes
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        context.closeModal(id);
      }
    } else {
      context.closeModal(id);
    }
  };

  return (
    <Paper radius="md" p="md" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Title"
          placeholder="Enter policy title"
          {...register("name")}
          error={errors.name?.message}
          withAsterisk
          mb="md"
          disabled={isLoading}
        />

        <Box mb="md">
          <Text fw={500} size="sm">
            Content
            <span style={{ color: "red" }}> *</span>
          </Text>
          <Text c="dimmed" size="xs" className="mb-[6px]">
            Use the toolbar to format your policy content
          </Text>

          {editor && (
            <RichTextEditor
              editor={editor}
              style={{ borderColor: errors.description ? "red" : undefined }}
            >
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

          {errors.description && (
            <Text c="red" size="sm" mt="xs" display="flex" ta="center">
              <IconInfoCircle size={14} style={{ marginRight: "5px" }} />
              {errors.description.message}
            </Text>
          )}
        </Box>

        <Group justify="flex-end" mt="lg">
          {/* <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button> */}
          <Button
            variant="outline"
            color="gray"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isDirty || Object.keys(errors).length > 0}
          >
            Create Policy
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CreatePolicy;
