export class Metadata {
    static setMaximumMergeLevels(levels) {
        MergedItem.MAXMIMUM_MERGE_LEVELS = levels;
        MergedItem.WORK2PENALTY = precalculatePriorWorkPenalty(levels);
        Hash.prior_work_bitcount = Math.ceil(Math.log2(MergedItem.WORK2PENALTY.length));
    }

    static setItem2Id(item2id) {
        Item.toId = item2id;
        Item.BOOK_ID = item2id["book"];
    }

    static setEnchantment2Id(enchantment2id) {
        Enchantment.toId = enchantment2id;
    }

    static setEnchantment2Weight(enchantment2weight) {
        Enchantment.toWeight = enchantment2weight;
    }

    static setItemNamespace(item_namespace) {
        Json.item_namespace = item_namespace;
    }
}

export class Hash {
    static item_id_bitcount = 1;
    static prior_work_bitcount = 3;

    static toPriorWork(item_hash) {
        const hash_bits = item_hash;
        const work_bits = (1 << Hash.prior_work_bitcount) - 1;
        const rightmost_hash_bits = hash_bits & work_bits;
        return rightmost_hash_bits;
    }

    static toIsBook(item_hash) {
        const hash_bits = item_hash;
        const work_bitcount = Hash.prior_work_bitcount;
        const nth_hash_bit = (hash_bits & (1 << work_bitcount)) >> work_bitcount;
        return nth_hash_bit;
    }

    static toEnchantmentList(enchantments_hash) {
        const enchantment_count = Enchantment.objs.length;
        const has_enchantment_count = numberOfOneBits(enchantments_hash);

        let enchantment_objs = new Array(has_enchantment_count);
        let found_count = 0;
        for (let index = 0; index < enchantment_count; ++index) {
            const enchantment_hash = 1 << index;
            const has_enchantment = (enchantments_hash & enchantment_hash) >> index;
            if (has_enchantment) {
                const enchantment_obj = Hash.toEnchantment(enchantment_hash);
                enchantment_objs[found_count++] = enchantment_obj;
            }
            if (found_count === has_enchantment_count) break;
        }

        return enchantment_objs;
    }

    static toEnchantment(enchantment_hash) {
        const index = rightmostBitIndex(enchantment_hash);
        return Enchantment.objs[index];
    }

    static toEnchantmentsHash(item_hash) {
        const item_bitcount = Hash.item_id_bitcount + Hash.prior_work_bitcount;
        const hash = item_hash >> item_bitcount;
        return hash;
    }

    static fromItems(items) {
        const hash = items
            .map((item) => item.hash)
            .sort()
            .reduce((previous_hash, hash) => previous_hash + hash + " ", "");
        return hash;
    }

    static fromNewItem(is_book, prior_work, enchantment_objs) {
        const work_bits = Hash.prior_work_bitcount;
        const id_bits = Hash.item_id_bitcount;
        const work_hash = prior_work;
        const id_hash = is_book << work_bits;
        const enchantments_hash = Hash.fromEnchantments(enchantment_objs) << (work_bits + id_bits);
        const hash = work_hash + id_hash + enchantments_hash;
        return hash;
    }

    static fromEnchantments(enchantment_objs) {
        return enchantment_objs.reduce((hash, enchantment_obj) => hash | enchantment_obj.hash, 0);
    }

    static fromNewEnchantment(enchantment_obj) {
        const index = Enchantment._indexOf(enchantment_obj);
        if (index !== -1) return Enchantment.objs[index].hash;
        Enchantment.objs.push(enchantment_obj);
        return 1 << (Enchantment.objs.length - 1);
    }
}

export class Json {
    static item_name = ""; // namespace of most recent non-book item, see Json.toItem

    static toItems(metadatas) {
        return metadatas.map((metadata) => Json.toItem(metadata));
    }

    static toItemTree(item) {
        if (item instanceof MergedItem) {
            const left_item = item.child_items[0],
                right_item = item.child_items[1];

            return {
                ...Json.fromItem(item),
                prior_work: item.getPriorWork(),
                left_item: Json.toItemTree(left_item),
                right_item: Json.toItemTree(right_item)
            };
        }

        if (item instanceof Item) return Json.fromItem(item);
    }

    static toItem(metadata) {
        const name = metadata["item"];
        const id = Item.toId[name];
        const is_book = id === Item.BOOK_ID;
        const prior_work = metadata["prior_work"];
        const enchantment_objs = Json.toEnchantments(metadata["enchantments"]);

        if (!is_book) Json.item_name = name;
        return new Item(is_book, enchantment_objs, prior_work);
    }

    static toEnchantments(metadatas) {
        return metadatas.map((metadata) => Json.toEnchantment(metadata));
    }

    static toEnchantment(metadata) {
        const name = metadata["name"];
        const id = Enchantment.toId[name];
        const level = parseInt(metadata["level"]);
        return new Enchantment(id, level);
    }

    static fromItem(item) {
        const is_book = item.isBook();
        const name = is_book ? "book" : Json.item_name;
        const enchantments_metadata = Json.fromEnchantments(item.getEnchantmentList());
        const prior_work = item.getPriorWork();

        const metadata = {
            item: name,
            enchantments: enchantments_metadata,
            prior_work: prior_work
        };
        return metadata;
    }

    static fromEnchantments(enchantment_objs) {
        return enchantment_objs.map((enchantment_obj) => Json.fromEnchantment(enchantment_obj));
    }

    static fromEnchantment(enchantment_obj) {
        const id = enchantment_obj.id;
        const enchantment_namespaces = Object.keys(Enchantment.toId);
        const enchantment_namespace = enchantment_namespaces.filter((name) => Enchantment.toId[name] === id)[0];
        return {
            name: enchantment_namespace,
            level: enchantment_obj.level
        };
    }
}

class Item {
    static BOOK_ID = 0;
    static toId = {};

    constructor(
        is_book,
        enchantment_objs,
        prior_work = 0,
        cumulative_levels = 0,
        cumulative_minimum_xp = 0,
        maximum_levels_per_step = 0
    ) {
        this.cumulative_levels = cumulative_levels;
        this.cumulative_minimum_xp = cumulative_minimum_xp;
        this.maximum_levels_per_step = maximum_levels_per_step;
        this.hash = Hash.fromNewItem(is_book, prior_work, enchantment_objs);
    }

    isBook() {
        return Hash.toIsBook(this.hash);
    }

    getPriorWork() {
        return Hash.toPriorWork(this.hash);
    }

    getEnchantmentList() {
        return Hash.toEnchantmentList(this.getEnchantmentsHash());
    }

    enchantmentCost() {
        return this.getEnchantmentList().reduce((cost, enchantment_obj) => cost + enchantment_obj.cost, 0);
    }

    getEnchantmentsHash() {
        return Hash.toEnchantmentsHash(this.hash);
    }
}

export class MergedItem extends Item {
    static MAXMIMUM_MERGE_LEVELS;
    static WORK2PENALTY;

    constructor(left_item, right_item) {
        const left_prior_work = left_item.getPriorWork();
        const right_prior_work = right_item.getPriorWork();

        const enchantments_obj = combineEnchantments(left_item.getEnchantmentList(), right_item.getEnchantmentList());
        const enchantments_cost = right_item.isBook()
            ? enchantments_obj.merge_levels
            : 2 * enchantments_obj.merge_levels;
        const prior_work_penalty = MergedItem.WORK2PENALTY[left_prior_work] + MergedItem.WORK2PENALTY[right_prior_work];
        const merge_levels = enchantments_cost + prior_work_penalty;

        super(
            left_item.isBook(),
            enchantments_obj.enchantment_objs,
            Math.max(left_prior_work, right_prior_work) + 1,
            left_item.cumulative_levels + right_item.cumulative_levels + merge_levels,
            left_item.cumulative_minimum_xp + right_item.cumulative_minimum_xp + experience(merge_levels),
            Math.max(left_item.maximum_levels_per_step, right_item.maximum_levels_per_step, merge_levels)
        );

        this.child_items = [left_item, right_item];
        this.merge_levels = merge_levels;
    }

    isAboveMergeLimit() {
        return this.merge_levels > MergedItem.MAXMIMUM_MERGE_LEVELS;
    }
}

class Enchantment {
    static toId = {};
    static toWeight = [];
    static hash2enchantment = {};
    static objs = [];

    constructor(id, level) {
        this.id = id;
        this.level = level;
        this.cost = Enchantment.toWeight[id] * level;
        this.hash = Hash.fromNewEnchantment(this); // must come last
    }

    static _indexOf(enchantment_obj) {
        const objs = Enchantment.objs;
        const enchantment_count = objs.length;
        for (let index = 0; index < enchantment_count; ++index) {
            const obj = objs[index];
            if (enchantment_obj.isEquivalent(obj)) return index;
        }
        return -1;
    }

    isEquivalent(other) {
        if (this.id !== other.id) return false;
        if (this.level !== other.level) return false;
        return true;
    }

    combine(right_enchantment_obj) {
        return this.id === right_enchantment_obj.id
            ? this._combineSame(right_enchantment_obj)
            : this._combineDifferent(right_enchantment_obj);
    }

    _combineSame(right_enchantment_obj) {
        const left_level = this.level;
        const right_level = right_enchantment_obj.level;
        const new_level = left_level === right_level ? left_level + 1 : Math.max(left_level, right_level);
        const new_enchantment = new Enchantment(this.id, new_level);
        return new Enchantments([new_enchantment], new_enchantment.cost);
    }

    _combineDifferent(right_enchantment_obj) {
        const new_enchantment_objs = [this, right_enchantment_obj];
        return new Enchantments(new_enchantment_objs, right_enchantment_obj.cost);
    }
}

class Enchantments {
    constructor(enchantment_objs, merge_levels = 0) {
        this.enchantment_objs = enchantment_objs;
        this.merge_levels = merge_levels;
    }
}

function combineEnchantments(left_objs, right_objs) {
    const merged_right = mergedRightEnchantments(left_objs, right_objs);
    const merged_enchantment_objs = merged_right.merged_objs;
    mergeLeftEnchantments(merged_enchantment_objs, left_objs, merged_right.left_ids_in_right);
    return new Enchantments(merged_enchantment_objs, merged_right.merge_levels);
}

function mergedRightEnchantments(left_objs, right_objs) {
    var merge_levels = 0;
    var merged_objs = [];
    var left_ids_in_right = [];

    const right_count = right_objs.length;
    const left_ids = getIds(left_objs);

    for (let right_index = 0; right_index < right_count; ++right_index) {
        const right_obj = right_objs[right_index];
        const right_id = right_obj.id;
        const left_index = left_ids.indexOf(right_id);

        if (left_index === -1) {
            merge_levels += right_obj.cost;
            merged_objs.push(right_obj);
            continue;
        }

        const left_obj = left_objs[left_index];
        const merged_enchantments_obj = left_obj._combineSame(right_obj);
        merge_levels += merged_enchantments_obj.merge_levels;
        merged_objs = merged_objs.concat(merged_enchantments_obj.enchantment_objs);
        left_ids_in_right.push(right_id);
    }

    return {
        merge_levels: merge_levels,
        merged_objs: merged_objs,
        left_ids_in_right: left_ids_in_right
    };
}

function mergeLeftEnchantments(merged_objs, left_objs, left_ids_in_right) {
    const left_count = left_objs.length;
    for (let left_index = 0; left_index < left_count; ++left_index) {
        const left_obj = left_objs[left_index];
        if (!left_ids_in_right.includes(left_obj.id)) {
            merged_objs.push(left_obj);
        }
    }
}

function experience(level) {
    if (level <= 16) return level ** 2 + 6 * level;
    if (level <= 31) return 2.5 * level ** 2 - 40.5 * level + 360;
    return 4.5 * level ** 2 - 162.5 * level + 2220;
}

function precalculatePriorWorkPenalty(maximum_merge_levels) {
    const max_prior_work = Math.ceil(Math.log2(maximum_merge_levels + 1));
    const prior_works = [...Array(max_prior_work).keys()];
    const prior_work2penalty = prior_works.map((prior_work) => 2 ** prior_work - 1);
    return prior_work2penalty;
}

function getIds(objs) {
    const count = objs.length;
    var ids = [];
    for (let index = 0; index < count; ++index) {
        const obj = objs[index];
        ids.push(obj.id);
    }
    return ids;
}

function numberOfOneBits(n) {
    let i = 0;
    do if (n & 1) ++i;
    while ((n >>= 1));
    return i;
}

function rightmostBitIndex(n) {
    let i = 0;
    do {
        if (n & 1) return i;
        ++i;
    } while ((n >>= 1));
}
