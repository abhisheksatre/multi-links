import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useRef } from "react";
import { LinkItem } from "../types";
import Service from './../Service';


function CreateForm(props: { data?: LinkItem; onCreate?: () => void }) {
   
    const nameFieldRef = useRef<Form.TextField>(null);
    const linksFieldRef = useRef<Form.TextArea>(null);
    const initialValues = props.data ?? { name: '', links: '', id: '', browser: '' };
    const mode = props.data ? 'edit' : 'create';

    async function handleSubmit(values: LinkItem) {
        
        if (values.name.trim() === '') {
            await showToast({ style: Toast.Style.Failure, title: "Name is required" });
            nameFieldRef.current?.focus();
            return;
        } else if (values.links.trim() === '') {
            await showToast({ style: Toast.Style.Failure, title: "Please add links" });
            linksFieldRef.current?.focus();
            return;
        }

        if (mode === 'create') {
            values.id = Math.random().toString(36).replace('0.','');
            await Service.setLink(values);
            showToast({ title: "Multilink Created" });
            nameFieldRef.current?.reset();
            linksFieldRef.current?.reset();
            props.onCreate?.();
        } else {
            const success = await Service.updateLink(initialValues.id, {...props.data, ...values});
            if (success) {
                showToast({ title: "Multilink Updated" });
                props.onCreate?.();
            } else {
                showToast({ title: "Update failed", style: Toast.Style.Failure});
            }
        }
        
    }

    return (
        <Form
        actions={
            <ActionPanel>
            <Action.SubmitForm title={`${mode === 'create' ? 'Create' : 'Update' } Multilink`} onSubmit={handleSubmit} />
            </ActionPanel>
        }
        >
            <Form.TextField id="name" title="Name" defaultValue={initialValues.name} placeholder="Multilink name" ref={nameFieldRef} />
            
            <Form.TextArea 
                title="Links"
                id="links" 
                placeholder="List of links (one per line)"
                defaultValue={initialValues.links}
                ref={linksFieldRef}
                />
            
            <Form.Dropdown id="browser" title="Open with" defaultValue={initialValues.browser}>
                <Form.Dropdown.Item value="com.google.Chrome" title="Google Chrome" />
                <Form.Dropdown.Item value="com.apple.Safari" title="Safari" />
                <Form.Dropdown.Item value="com.brave.Browser" title="Brave Browser" />
            </Form.Dropdown>
            
        </Form>
    )
}

export default CreateForm;