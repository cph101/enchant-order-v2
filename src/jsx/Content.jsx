import EnchantSelect from "./EnchantSelect";
import ItemDisplay from "./ItemDisplay";

export default function Content() {
    return (
        <div className="px-7">
            <div className="grid grid-cols-7 grid-rows-1 mx-auto">
                <div className="col-span-5">
                    <EnchantSelect />
                </div>
                <div />
                <div>
                    <ItemDisplay />
                </div>
            </div>
        </div>
    );
}
