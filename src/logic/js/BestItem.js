import { MergedItem, Hash } from "./Item.js";

export class BestItem {
    constructor(definition, heuristic_splits = 0) {
        this.heuristic_splits = heuristic_splits;
        this.definition = definition;
        this.memory = {};
        this.memory_check_count = 0;
    }

    calculate(items) {
        items = preparedItems(items, this);
        const candidates = this.fromList(items);
        return candidates;
    }

    _fromListN(items) {
        const max_item_subcount = Math.floor(0.5 * items.length);
        var candidates = [];

        for (let item_subcount = 1; item_subcount <= max_item_subcount; ++item_subcount) {
            const item_combinations = combinations(items, item_subcount);
            for (let left_index = 0; left_index < item_combinations.length; ++left_index) {
                const left_items = item_combinations[left_index];
                const right_items = items.filter((item) => !left_items.includes(item));
                const left_candidates = this.fromList(left_items);
                const right_candidates = this.fromList(right_items);
                const new_candidates = this._fromLists2(left_candidates, right_candidates);
                pushArray(candidates, new_candidates);
            }
        }

        return candidates;
    }

    _fromLists2(left_items, right_items) {
        const left_count = left_items.length,
            right_count = right_items.length;

        var candidates = [];

        for (let left_index = 0; left_index < left_count; ++left_index) {
            const left_item = left_items[left_index];
            for (let right_index = 0; right_index < right_count; ++right_index) {
                const right_item = right_items[right_index];
                const new_candidates = this.fromList([left_item, right_item]);
                pushArray(candidates, new_candidates);
            }
        }

        return candidates;
    }

    _fromListRaw(items) {
        switch (items.length) {
            case 1:
                return [items[0]];
            case 2:
                return BetterItem.candidates(items[0], items[1]);
            default:
                return this._fromListN(items);
        }
    }

    fromList(items) {
        const items_hash = Hash.fromItems(items);
        const from_memory = this.memory[items_hash];
        this.memory_check_count++;
        if (from_memory !== undefined) return from_memory;

        const definition = this.definition;
        var candidates = this._fromListRaw(items);
        candidates = RemoveDuplicatesBy.hash(candidates, definition);
        candidates = RemoveDuplicatesBy.priorWorkAfterHash(candidates, definition);
        this.memory[items_hash] = candidates;
        return candidates;
    }
}

function preparedItems(items, best_itemer) {
    const heuristic_count = best_itemer.heuristic_splits;
    for (let layer = 0; layer < heuristic_count; ++layer) {
        items = premergedItems(items, best_itemer);
    }

    return items;
}

function premergedItems(items, best_itemer) {
    items = items.sort((item1, item2) => item1.enchantmentCost() - item2.enchantmentCost());

    const item_count = items.length;
    const max_index = (item_count - 1) / 2;
    var merged_items = [];

    for (let index = 0; index < max_index; ++index) {
        const last_index = item_count - 1 - index;
        const item1 = items[index];
        const item2 = items[last_index];
        const merged_item = best_itemer.fromList([item1, item2])[0];
        const new_item = index === last_index ? item1 : merged_item;
        merged_items.push(new_item);
    }

    return merged_items;
}

function combinations(set, subset_size) {
    const set_length = set.length;
    if (subset_size === 1) return set.map((subset) => [subset]);
    if (subset_size === set_length) return [set];
    if (subset_size > set_length || subset_size <= 0) return [];

    var combos = [];
    for (let index = 0; index < set_length - subset_size + 1; ++index) {
        const combo_head = set.slice(index, index + 1);
        const combo_tails = combinations(set.slice(index + 1), subset_size - 1);

        for (let tail_index = 0; tail_index < combo_tails.length; ++tail_index) {
            const combo_tail = combo_tails[tail_index];
            const new_combo = [...combo_head];
            pushArray(new_combo, combo_tail);
            combos.push(new_combo);
        }
    }

    return combos;
}

class RemoveDuplicatesBy {
    static hash(items, definition) {
        // keeps only cheapest item per combination of enchantments

        const item_count = items.length;
        if (item_count <= 1) return items;

        const first_item = items[0];
        var new_items = [first_item];
        var previous_hashes = [first_item.hash];

        for (let item_index = 1; item_index < item_count; ++item_index) {
            const new_item = items[item_index];
            const hash = new_item.hash;

            const previous_index = previous_hashes.indexOf(hash);
            if (previous_index === -1) {
                new_items.push(new_item);
                previous_hashes.push(hash);
                continue;
            }

            const previous_item = new_items[previous_index];
            if (BetterItem.isRight(previous_item, new_item, definition)) new_items[previous_index] = new_item;
        }

        return new_items;
    }

    static priorWorkAfterHash(items, definition) {
        // keeps only cheapest item per combination of prior work
        // assumes unique hashes, i.e. by first removing duplicates by hash

        const item_count = items.length;
        if (item_count <= 1) return items;

        const hash2items = Group.byEnchantments(items, definition);
        const enchantment_hashes = Object.keys(hash2items);
        var candidates = [];

        for (let hash_index = 0; hash_index < enchantment_hashes.length; ++hash_index) {
            const enchantment_hash = enchantment_hashes[hash_index];
            const new_items = hash2items[enchantment_hash];
            const new_candidates = RemoveDuplicatesBy._priorWork(new_items, definition);
            pushArray(candidates, new_candidates);
        }

        return candidates;
    }

    static _priorWork(items, definition) {
        // keeps only cheapest item per prior work
        // even if items have different enchantments

        if (items.length <= 1) return items;

        const work2items = Group.byPriorWork(items);
        const prior_works = Object.keys(work2items);
        const first_items = work2items[prior_works[0]];
        let best_item = BetterItem.fromList(first_items, definition);
        var candidates = [best_item];

        for (let work_index = 1; work_index < prior_works.length; ++work_index) {
            const prior_work = prior_works[work_index];
            const new_items = work2items[prior_work];
            const best_item_at_work = BetterItem.fromList(new_items, definition);

            if (BetterItem.isRight(best_item, best_item_at_work, definition)) {
                best_item = best_item_at_work;
                candidates.push(best_item_at_work);
            }
        }

        return candidates;
    }
}

class Group {
    static _asDictionary(elements, getKey) {
        const element_count = elements.length;
        var key2elements = {};

        for (let index = 0; index < element_count; ++index) {
            const new_element = elements[index];
            const key = getKey(new_element);
            pushToDictionary(new_element, key, key2elements);
        }

        return key2elements;
    }

    static byEnchantments(items) {
        return Group._asDictionary(items, (new_item) => new_item.getEnchantmentsHash());
    }

    static byPriorWork(items) {
        return Group._asDictionary(items, (new_item) => new_item.getPriorWork());
    }
}

class BetterItem {
    static candidates(left_item, right_item) {
        const left_item_is_book = left_item.isBook();
        const right_item_is_book = right_item.isBook();
        if (!left_item_is_book && right_item_is_book) return itemIfWithinMergeLimit(left_item, right_item);
        if (left_item_is_book && !right_item_is_book) return itemIfWithinMergeLimit(right_item, left_item);

        const normal_item = new MergedItem(left_item, right_item);
        if (normal_item.isAboveMergeLimit()) return itemIfWithinMergeLimit(right_item, left_item);
        const reversed_item = new MergedItem(right_item, left_item);
        if (reversed_item.isAboveMergeLimit()) return [normal_item];
        return [normal_item, reversed_item];
    }

    static fromList(items, definition) {
        const item_count = items.length;
        if (item_count === 1) return items[0];

        let best_item = items[0];
        for (let item_index = 1; item_index < item_count; ++item_index) {
            const new_item = items[item_index];
            if (BetterItem.isRight(best_item, new_item, definition)) best_item = new_item;
        }

        return best_item;
    }

    static isRight(item1, item2, definition) {
        const better_side = BetterItem.side(item1, item2, definition);
        return better_side === 1;
    }

    static side(item1, item2, definition) {
        const mode_count = definition.length;
        for (let mode_index = 0; mode_index < mode_count; ++mode_index) {
            const mode = definition[mode_index];
            const better_side = BetterItem.byMode(item1, item2, mode);
            if (better_side !== 0) return better_side;
        }

        return 0;
    }

    static byMode(item1, item2, mode) {
        switch (mode) {
            case 0:
                return BetterItem.byCumulativeLevels(item1, item2);
            case 1:
                return BetterItem.byCumulativeXp(item1, item2);
            case 2:
                return BetterItem.byLevelPerStep(item1, item2);
        }
    }

    static byCumulativeLevels(item1, item2) {
        return Math.sign(item1.cumulative_levels - item2.cumulative_levels);
    }

    static byCumulativeXp(item1, item2) {
        return Math.sign(item1.cumulative_minimum_xp - item2.cumulative_minimum_xp);
    }

    static byLevelPerStep(item1, item2) {
        return Math.sign(item1.maximum_levels_per_step - item2.maximum_levels_per_step);
    }
}

function itemIfWithinMergeLimit(item1, item2) {
    const merged_item = new MergedItem(item1, item2);
    if (merged_item.isAboveMergeLimit()) return [];
    return [merged_item];
}

function pushArray(arr1, arr2) {
    const arr2_size = arr2.length;
    for (let index2 = 0; index2 < arr2_size; ++index2) {
        const elem2 = arr2[index2];
        arr1.push(elem2);
    }
}

function pushToDictionary(value, key, key2values) {
    key = key.toString();
    const is_new_key = !Object.keys(key2values).includes(key);
    if (is_new_key) key2values[key] = [];
    key2values[key].push(value);
}
