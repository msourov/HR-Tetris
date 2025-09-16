import {
  Box,
  Button,
  Modal,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useDeletePolicyMutation,
  useEditPolicyMutation,
  useGetPoliciesQuery,
} from "../../../../features/api/policySlice";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import AppLoader from "../../../../components/ui/AppLoader";
import { AllPolicy } from "../../../../features/types/policy";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
  description: z.string(),
});

type EditDesignationType = z.infer<typeof schema>;

const ManagePolicy = () => {
  const [policy, setPolicy] = useState<string | null>(null);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const { data: policies } = useGetPoliciesQuery({
    page: 1,
    limit: 10,
  });
  const [editPolicy, { isLoading: editPolLoading }] = useEditPolicyMutation();
  const [deletePolicy, { isLoading: deletePolLoading }] =
    useDeletePolicyMutation();
  // const toggleModal = () => {
  //   addClose();
  // };

  const policyOptions = Array.isArray(policies?.data)
    ? policies.data.map((item: AllPolicy) => ({
        value: item?.uid,
        label: item?.name,
      }))
    : [];

  const policyDetail = Array.isArray(policies?.data)
    ? policies.data.find((item) => item?.uid === policy)
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditDesignationType>({
    resolver: zodResolver(schema),
  });

  console.log(errors, "errors");

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
    onUpdate: ({ editor }) => {
      setValue("description", editor.getHTML());
    },
  });

  useEffect(() => {
    if (policyDetail) {
      reset({
        name: policyDetail?.name,
        description: policyDetail?.descriptions ?? "",
        active: policyDetail?.active,
      });
      editor?.commands.setContent(policyDetail?.descriptions || "");
    }
  }, [policyDetail, reset, editor]);

  console.log(policyDetail, "policyDetail");

  // const activeStatus = watch("active");

  const text = (
    <Text fw={500} mb={4}>
      Select Policy
    </Text>
  );

  const onSubmit = async (data: EditDesignationType) => {
    if (!policy) {
      notifications.show({
        title: "Error!",
        message: "No policy selected",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    const obj = {
      uid: policy,
      name: data.name,
      written_policy: data.description,
      active: data.active,
    };
    try {
      await editPolicy(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: "Succesfully updated policy",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't update policy",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePolicy({ id: policy as string }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Policy successfully deleted.",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setPolicy(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't delete policy. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeDelete();
    }
  };

  return (
    <Box className="my-6">
      <Select
        label={text}
        data={policyOptions}
        value={policy}
        onChange={(value) => {
          if (value) {
            setPolicy(value);
          } else {
            setPolicy("");
          }
        }}
        mt={8}
      />
      {policy && (
        <Paper shadow="sm" p="md" my={16}>
          {policyDetail ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label={<p className="text-gray-600">Title</p>}
                mb={10}
                {...register("name")}
                error={errors.name?.message as React.ReactNode}
              />
              {editor && (
                <Box mt={20}>
                  <Text mb={4} fw={500} className="text-gray-600">
                    Content
                  </Text>
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
                  {errors.description?.message && (
                    <Text size="xs" c="red" mt={4}>
                      {errors.description.message}
                    </Text>
                  )}
                </Box>
              )}

              <Box className="mt-4">
                <label className="text-gray-600">Status</label>
                <Switch
                  size="sm"
                  checked={watch("active")}
                  {...register("active")}
                />
              </Box>
              <div className="flex justify-end gap-2">
                <Button variant="outline" color="gray">
                  Cancel
                </Button>
                <Button type="submit" disabled={editPolLoading}>
                  {editPolLoading ? <AppLoader /> : "Save"}
                </Button>
              </div>
            </form>
          ) : (
            <Text className="text-center">Error loading data</Text>
          )}
        </Paper>
      )}
      {policyDetail && (
        <>
          <Box className="flex justify-end mt-10">
            <Button variant="light" color="red" onClick={openDelete}>
              Delete
            </Button>
          </Box>
          <Modal
            opened={deleteOpened}
            onClose={closeDelete}
            centered
            className="text-center"
          >
            <Text>Are you sure you want to delete this policy?</Text>
            <Box className="flex gap-2 justify-center mt-4">
              <Button
                color="red"
                onClick={handleDelete}
                disabled={deletePolLoading}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                color="gray"
                onClick={closeDelete}
                disabled={deletePolLoading}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default ManagePolicy;
