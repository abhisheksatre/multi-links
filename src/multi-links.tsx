import { ActionPanel, Action, open, List, confirmAlert, AlertActionStyle, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import Service from './Service';
import CreateForm from './Components/CreateForm';

export default function() {  

    const [links, setLinks] = useState([]);

    const fetchLinks = async function() {
        const links = await Service.getLinks();
        setLinks([...links]);
    }

    useEffect(() => {
        fetchLinks();
    }, []);
    

    function openLinks(linkItem: Service.LinkItem) {
        linkItem.links.split('\n').forEach(link => {
            open(link, link.browser);    
        })
    }

    async function deleteLink(index) {

        const options: Alert.Options = {
            title: "Are you sure?",
            primaryAction: {
              title: "Confirm",
              style: AlertActionStyle.Destructive,
              onAction: async () => {
                await Service.deleteLink(index)
                fetchLinks()
                showToast(Toast.Style.Success, "Multilink deleted!")
              },
            },
        };
        await confirmAlert(options);

    }

  return (
    <List
        actions={
            <ActionPanel>
                <Action.Push title="Create Link" target={<CreateForm onCreate={fetchLinks} />} />
            </ActionPanel>
        }
    >
        {
            links.map((link, index) =>
                <List.Item key={link.name} title={link.name} actions={
                    <ActionPanel>
                        <Action title="Select" onAction={() => openLinks(link)} />
                        <Action.Push title="Edit" target={<CreateForm data={link} onCreate={fetchLinks} />} />
                        <Action title="Delete" onAction={() => deleteLink(index)} />
                    </ActionPanel>
                } />)
        }
    </List>
  );

}
