import CONTENT from "~/data/new-order-data";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import "~/styles/new-order.css"
import { useQuery } from "@tanstack/react-query";
import { getCakeShapes, getCakeSizes, getCakeToppings } from "~/api/cake-order-api";

const options = [
  { label: "Grapes 🍇", value: "grapes" },
  { label: "Mango 🥭", value: "mango" },
  { label: "Strawberry 🍓", value: "strawberry" },
];

const NewOrder = () => {
  const queryShapes = useQuery({
    queryKey: ["cake-shapes"], queryFn: getCakeShapes,
    enabled: true,
    select: (data) => data.data.shapes,
    retry: 1,
  });
  const querySizes = useQuery({
    queryKey: ["cake-sizes"], queryFn: getCakeSizes,
    enabled: true,
    select: (data) => data.data.sizes,
    retry: 1,
  });
  const queryToppings = useQuery({
    queryKey: ["cake-toppings"], queryFn: getCakeToppings,
    enabled: true,
    select: (data) => data.data.toppings,
    retry: 1,
  });

  useEffect(() => {
    console.log(queryShapes.data);
    console.log(querySizes.data);
    console.log(queryToppings.data);
  }, [queryShapes.data, querySizes.data, queryToppings.data])

  const [selected, setSelected] = useState([]);
  return (
    <section id={CONTENT.id} className="dark:bg-gray-800 bg-white relative overflow-hidden w-screen h-screen">
      <nav className="h-24 sm:h-32 flex items-center z-30 w-full">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
            {CONTENT.logo}
          </div>
          <div className="flex items-center">
            <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
              <button className="py-2 px-6 flex bg-transparent border-blue-400">
                {CONTENT.logout}
              </button>
            </nav>
            <button className="lg:hidden flex flex-col ml-4">
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
              </span>
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
              </span>
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
              </span>
            </button>
          </div>
        </div>
      </nav>
      <form className="max-w-2xl w-full bg-gray-900 mx-auto p-10 rounded-3xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">{CONTENT.title}</h1>
        <div className="mb-6">
          <label htmlFor="cake-shape" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{CONTENT.shapeOfTheCake}</label>
          <select id="cake-shape" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>{CONTENT.chooseShape}</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="cake-size" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{CONTENT.sizeOfTheCake}</label>
          <select id="cake-size" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>{CONTENT.chooseSize}</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="cake-topping" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{CONTENT.toppingsForTheCake}</label>
          <MultiSelect
            options={options}
            value={selected}
            onChange={setSelected}
            labelledBy={CONTENT.toppingsForTheCake}
            className="block w-full px-2 py-2 text-base border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            ItemRenderer={DefaultItemRenderer}
            hasSelectAll={false}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{CONTENT.message}</label>
          <input type="text" id="message" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </section>

  )
}

export default NewOrder;

export interface Option {
  value: any;
  label: string;
  key?: string;
  disabled?: boolean;
}
interface IDefaultItemRendererProps {
  checked: boolean;
  option: Option;
  disabled?: boolean;
  onClick: () => void;
}

const DefaultItemRenderer = ({
  checked,
  option,
  onClick,
  disabled,
}: IDefaultItemRendererProps) => (
  <div className={`item-renderer flex flex-row justify-between ${disabled ? "disabled" : ""}`}>
    <div>
      <input
        type="checkbox"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span>{option.label}</span>
    </div>
    <input
      type="number"
      className="bg-gray-700 border rounded-lg text-center border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
      max={12}
      min={1}
      defaultValue={1}
    />
  </div>
);