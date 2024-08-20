import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FileButton,
  Loader,
  Paper,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Editor, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { useState } from "react";
import { useAddPolicyMutation } from "../../../../features/api/policySlice";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
  description: z.string().min(1, { message: "Description is required" }),
  file: z.instanceof(File).nullable().optional(),
});

type AddPolicy = z.infer<typeof schema>;

interface AddPolicyProps {
  toggleModal: () => void;
}

const AddPolicy: React.FC<AddPolicyProps> = ({ toggleModal }) => {
  const [addPolicy, { isLoading }] = useAddPolicyMutation();
  const [file, setFile] = useState<File | null>(null);
  //   const [content, setContent] = useState("");
  const {
    register,
    watch,
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
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    // content,
    onUpdate: ({ editor }) => {
      setValue("description", editor.getHTML());
    },
  });

  const activeStatus = watch("active");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file && setFile(file);
  };

  const onSubmit = async (data: AddPolicy) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("upload_file", file);
      }

      const jsonData = {
        name: data.name,
        description: data.description,
        active: data.active,
      };

      const response = await addPolicy({ ...jsonData, formData }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Designation Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't create Designation",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      toggleModal();
    }
  };

  return (
    <div>
      <Paper withBorder shadow="md" radius="md" p="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Name"
            {...register("name")}
            error={errors.name?.message as React.ReactNode}
          />
          <Box className="max-w-20 mt-4">
            <Switch
              size="lg"
              onLabel="Disable"
              offLabel="Activate"
              color="black"
              checked={activeStatus}
              {...register("active")}
            />
          </Box>
          <Box mt={20}>{descriptionEditor(editor)}</Box>
          {/* <Group justify="center"> */}
          <Box mt={20}>
            <FileButton
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button {...props} bg={"black"}>
                  Upload file
                </Button>
              )}
            </FileButton>
          </Box>

          {/* </Group> */}
          <Button
            type="submit"
            className="rounded-lg mt-6 bg-black"
            disabled={isLoading}
          >
            {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

const descriptionEditor = (editor: Editor | null) => (
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
);
export default AddPolicy;
