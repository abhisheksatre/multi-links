import { LocalStorage } from "@raycast/api";

interface LinkItem {
    id: string,
    name: string;
    links: string;
    browser: string;
}

class Service {

    static async getLinks() {
        const links = await LocalStorage.getItem("links");
        return links ? JSON.parse(links) : [];
    }
  
    static async setLink(item: LinkItem): LinkItem[] {
        const links = await this.getLinks();
        links.push(item);
        await LocalStorage.setItem("links", JSON.stringify(links));
        
        return links;
    }

    static async updateLink(id: string, item: LinkItem) {
        const links = await this.getLinks();
        const index = links.findIndex(link => link.id === id);
        if (index !== -1) {
            links[index] = item;
            await LocalStorage.setItem("links", JSON.stringify(links));

            return true;
        }

        return false;
    }

    static async deleteLink(index) {
        const links = await this.getLinks();
        links.splice(index, 1);
        await LocalStorage.setItem("links", JSON.stringify(links));
        
        return links;
    }
}

export default Service;
export type { LinkItem };
