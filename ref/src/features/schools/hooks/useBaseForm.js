import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

export default function useBaseForm({
    initialValues,
    validate,
    mutationFn,
    onSuccess
}) {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        mode: "uncontrolled",
        validate,
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

    function openModal () {
        form.setValues(initialValues);
        open();
    }

    async function handleSubmit (values) {
        try {
            await mutationFn(values);
            close();
            onSuccess?.();
        } catch (error) {
            console.error("Form submission failed:", error);
        }
    }

    return {
        opened,
        open: openModal,
        close,
        form,
        handleSubmit
    }
}