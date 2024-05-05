import { Metadata as ItemMetadata } from "./Item.js";

export function update(data) {
    Metadata.modpackIsLoaded = false;

    const maximum_merge_levels = data["other"]["maximum_merge_levels"];
    const enchantments_metadata = data["enchantments"];
    const items_metadata = data["items"];
    const item_namespaces = Object.keys(items_metadata);
    const enchantment_namespaces = Object.keys(enchantments_metadata);

    Metadata.enchantments = enchantments_metadata;

    const item2id = invertList(item_namespaces); // dictionary from item namespace (string) to ID (int)
    const enchantment2id = invertList(enchantment_namespaces); // dictionary from enchantment namespace (string) to ID (int)
    const enchantment2weight = Metadata.enchantmentToWeight(enchantment_namespaces); // dictionary from enchantment ID (int) to weight (int)

    ItemMetadata.setMaximumMergeLevels(maximum_merge_levels);
    ItemMetadata.setItem2Id(item2id);
    ItemMetadata.setEnchantment2Id(enchantment2id);
    ItemMetadata.setEnchantment2Weight(enchantment2weight);

    Metadata.items = items_metadata;
    Metadata.layout = data["layout"];
    Metadata.modpackIsLoaded = true;
}

export class Metadata {
    static modpackIsLoaded = false; // gets set to true after metadata for items and enchantments loads
    static enchantments = {}; // dictionary from enchantment namespace (string) to metadata (dict)
    static items = {}; // dictionary from item namespace (string) to metadata (dict)
    static layout = {}; // dictionary from tab namespace (string) to metadata (dict)

    static enchantmentToWeight(enchantment_namespaces) {
        const enchantments_metadata = Metadata.enchantments;
        var enchantment2weight = new Array(enchantment_namespaces.length);

        for (let enchantment_id = 0; enchantment_id < enchantment_namespaces.length; ++enchantment_id) {
            const enchantment_namespace = enchantment_namespaces[enchantment_id];
            const enchantment_metadata = enchantments_metadata[enchantment_namespace];
            const enchantment_weight = enchantment_metadata["weight"];
            enchantment2weight[enchantment_id] = enchantment_weight;
        }
        return enchantment2weight;
    }

    static enchantmentToMaxLevel(enchantment_namespace) {
        const enchantments_metadata = Metadata.enchantments;

        const enchantment_metadata = enchantments_metadata[enchantment_namespace];
        return enchantment_metadata["level_max"];
    }

    static itemToEnchantmentNames(item_namespace) {
        if (!Metadata.modpackIsLoaded) return [];

        const enchantments_metadata = Metadata.enchantments;
        const enchantment_namespaces = Object.keys(enchantments_metadata);
        var compatible_enchantments = [];

        for (let enchantment_namespace of enchantment_namespaces) {
            const enchantment_items = enchantments_metadata[enchantment_namespace]["items"];
            for (let enchantment_item of enchantment_items) {
                if (item_namespace === enchantment_item) {
                    compatible_enchantments.push(enchantment_namespace);
                }
            }
        }

        return compatible_enchantments;
    }

    static itemNamespaceToName(item_namespace) {
        if (!Metadata.modpackIsLoaded) return "";
        return Metadata.items[item_namespace]["stylized"];
    }

    static tabNamespaceToName(tab_namespace) {
        if (!Metadata.modpackIsLoaded) return "";
        return Metadata.layout[tab_namespace]["stylized"];
    }

    static getLayout() {
        const layout_metadata = Metadata.layout;
        const tab_namespaces = Object.keys(layout_metadata);
        var layout = {};

        for (let tab_namespace of tab_namespaces) {
            const item_namespaces = layout_metadata[tab_namespace]["items"];
            layout[tab_namespace] = item_namespaces;
        }

        return layout;
    }
}

function invertList(list) {
    return Object.fromEntries(list.map((element, index) => [element, index]));
}
