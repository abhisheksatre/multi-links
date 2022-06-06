import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useRef } from "react";
import { ActionPanel, Action } from "@raycast/api";
import Service from './../Service';


function CreateForm() {
   
    const nameFieldRef = useRef<Form.TextField>(null);
    const linksFieldRef = useRef<Form.TextArea>(null);

    async function handleSubmit(values: Service) {
        
        if (values.name.trim() === '') {
            await showToast({ style: Toast.Style.Failure, title: "Name is required" });
            nameFieldRef.current?.focus();
            return;
        } else if (values.links.trim() === '') {
            await showToast({ style: Toast.Style.Failure, title: "Please add links" });
            linksFieldRef.current?.focus();
            return;
        }

        await Service.setLink(values);
        showToast({ title: "Link Created" });
        nameFieldRef.current?.reset();
        linksFieldRef.current?.reset();
    }

    return (
        <Form
        actions={
            <ActionPanel>
            <Action.SubmitForm title="Create Multilink" onSubmit={handleSubmit} />
            </ActionPanel>
        }
        >
            <Form.TextField id="name" title="Name" placeholder="Multilink name" ref={nameFieldRef} />
            
            <Form.TextArea 
                title="Links"
                id="links" 
                placeholder="List of links (one per line)"
                ref={linksFieldRef}
                />
            
            <Form.Dropdown id="browser" title="Open with">
                <Form.Dropdown.Item value="com.google.Chrome" title="Google Chrome" />
                <Form.Dropdown.Item value="com.apple.Safari" title="Safari" />
                <Form.Dropdown.Item value="com.brave.Browser" title="Brave Browser" />
            </Form.Dropdown>
            
        </Form>
    )
}

export default CreateForm;