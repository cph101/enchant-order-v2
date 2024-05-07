import { Settings } from "../js/settings.js";
import { Json } from "../js/Item.js";
import { BestItem } from "../js/BestItem.js";

Settings.loadSettings();

const item_filepath = "/examples/god_boots+.json"; // filepath for JSON file with enchanted items to be merged
fetch(item_filepath)
    .then((response) => response.json())
    .then(findOptimalCombination); // find optimal combo for given list of items

function findOptimalCombination(items_metadata) {
    const best_definition = [1, 0, 2];
    const heuristic_layer_count = 6;

    const items = Json.toItems(items_metadata);
    const best_itemer = new BestItem(best_definition, heuristic_layer_count);
    const t1 = performance.now();
    const item_candidates = best_itemer.calculate(items);
    const t2 = performance.now();

    const hashes = item_candidates.map((item) => item.hash);
    const cum_levels = item_candidates.map((item) => item.cumulative_levels);
    const cum_xp = item_candidates.map((item) => item.cumulative_minimum_xp);
    const max_levels = item_candidates.map((item) => item.maximum_levels_per_step);
    const best_memory = best_itemer.memory;
    const keys = Object.keys(best_memory);

    console.log("hashes:", hashes); // outputs unique hashes for each final unique item
    console.log("cumulative levels:", cum_levels); // outputs cumulative levels and XP for each final unique item
    console.log("cumulative XP:", cum_xp); // outputs cumulative XP for each final unique item
    console.log("max levels:", max_levels); // outputs max levels for a single merge, for each final unique item
    console.log("memory size:", keys.length); // number of unique combinations checked
    console.log("time:", t2 - t1); // time taken to find best combinations (in milliseconds)

    const item_trees = item_candidates.map((item) => Json.toItemTree(item)); // list of merged items as JSON, similar to input JSON items
    console.log(item_trees); // outputs JSON structure containing info on how to best merge items
}
