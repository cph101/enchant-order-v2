import { TRACKED_DATA } from "../bridge.mjs";
import { Metadata as ItemMetadata } from "./Item.js";

export function update(data) {
    const maximum_merge_levels = data["other"]["maximum_merge_levels"];
    const enchantments_metadata = data["enchantments"];
    const items_metadata = data["items"];
    const item_namespaces = Object.keys(items_metadata);
    const enchantment_namespaces = Object.keys(enchantments_metadata);

    Metadata.enchantments = enchantments_metadata;
    Metadata.items = items_metadata;
    Metadata.item_namespaces = item_namespaces;
    Metadata.enchantment_namespaces = enchantment_namespaces;

    // dictionary from item namespace (string) to ID (int)
    const item2id = invertList(item_namespaces);
    // dictionary from enchantment namespace (string) to ID (int)
    const enchantment2id = invertList(enchantment_namespaces);
    // dictionary from enchantment ID (int) to weight (int)
    const enchantment2weight = Metadata.enchantmentToWeight(enchantment_namespaces);
    // dictionary from item ID (int) to enchantment IDs (array of int)
    const item2enchantments = Metadata.itemToEnchantments(item_namespaces, enchantment_namespaces, item2id);

    ItemMetadata.setMaximumMergeLevels(maximum_merge_levels);
    ItemMetadata.setItem2Id(item2id);
    ItemMetadata.setEnchantment2Id(enchantment2id);
    ItemMetadata.setEnchantment2Weight(enchantment2weight);

    TRACKED_DATA.itemToEnchants = item2enchantments;
    TRACKED_DATA.itemsToIds = item2id;
    TRACKED_DATA.idsToEnchants = enchantment_namespaces;
}

class Metadata {
    static enchantments = {};
    static items = {};
    static item_namespaces = [];
    static enchantment_namespaces = [];

    static enchantmentToWeight(enchantment_namespaces) {
        const enchantments_metadata = this.enchantments;
        var enchantment2weight = new Array(enchantment_namespaces.length);

        for (let enchantment_id = 0; enchantment_id < enchantment_namespaces.length; ++enchantment_id) {
            const enchantment_namespace = enchantment_namespaces[enchantment_id];
            const enchantment_metadata = enchantments_metadata[enchantment_namespace];
            const enchantment_weight = enchantment_metadata["weight"];
            enchantment2weight[enchantment_id] = enchantment_weight;
        }
        return enchantment2weight;
    }

    static itemToEnchantments(item_namespaces, enchantment_namespaces, item2id) {
        const enchantments_metadata = this.enchantments;
        var item2enchantments = Object.fromEntries(item_namespaces.map((item_namespace, item_id) => [item_id, []]));

        for (let enchantment_id = 0; enchantment_id < enchantment_namespaces.length; ++enchantment_id) {
            const enchantment_namespace = enchantment_namespaces[enchantment_id];
            const enchantment_metadata = enchantments_metadata[enchantment_namespace];
            const enchantment_items = enchantment_metadata["items"];
            enchantment_items.forEach(item_namespace => {
                const item_id = item2id[item_namespace];
                item2enchantments[item_id].push(enchantment_id);
            });
        }
        return item2enchantments;
    }
}

function invertList(list) {
    return Object.fromEntries(list.map((element, index) => [element, index]));
}
