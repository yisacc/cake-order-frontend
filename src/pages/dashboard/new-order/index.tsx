import CONTENT from "~/data/new-order-data";
import { useEffect, useState } from "react";
import "~/styles/new-order.css"
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrder, getCakePrice, getCakeShapes, getCakeSizes, getCakeToppings } from "~/api/cake-order-api";
import { useCookies } from "react-cookie";
import { logoutUserFn } from "~/api/auth-api";
import useQueryEvents from "~/lib/query-wrapper";
import { toast } from "react-toastify";
import Loader from "~/design-system/components/Loader";
import { CakeOrder, ICakeShape, ICakeSize, ICakeTopping } from "~/api/types";
import delay from "~/lib/delay";

const NewOrder = () => {
  const [, , removeCookie] = useCookies();
  const query = useQuery({
    queryKey: ["logoutUser"],
    queryFn: logoutUserFn,
    enabled: false,
    retry: 1,
  });
  useQueryEvents(query, {
    onSuccess: () => {
      toast.success("You have been logged out");
      removeCookie('access_token');
      removeCookie('refresh_token');
      removeCookie('logged_in');
    }

  })
  const queryShapes = useQuery({
    queryKey: ["cake-shapes"], queryFn: getCakeShapes,
    enabled: true,
    select: (data) => data as unknown as ICakeShape[],
    retry: 1,
  });
  const querySizes = useQuery({
    queryKey: ["cake-sizes"], queryFn: getCakeSizes,
    enabled: true,
    select: (data) => data as unknown as ICakeSize[],
    retry: 1,
  });
  const queryToppings = useQuery({
    queryKey: ["cake-toppings"], queryFn: getCakeToppings,
    enabled: true,
    select: (data) => (data as unknown as ICakeTopping[]).map((topping: any) => ({ label: topping.type, value: topping.id, quantity: 0 })),
    retry: 1,
  });

  const [selectedToppings, setSelectedToppings] = useState<{ value: string, quantity: number }[]>([]);
  const [maxStrawberry, setMaxStrawberry] = useState(12);
  const handleQuantityChange = (value: string, quantity: number) => {
    if (quantity === 0) {
      const index = selectedToppings?.findIndex((topping) => topping.value === value);
      if (index !== -1) {
        const strawberry = selectedToppings[index];
        setSelectedToppings((prev) => prev?.filter((topping) => topping.value !== value));
        setMaxStrawberry((prev) => prev + strawberry.quantity);

      }
    } else {
      const index = selectedToppings?.findIndex((topping) => topping.value === value);
      if (index !== -1) {
        const strawberry = selectedToppings[index];
        if ((quantity) > maxStrawberry + strawberry.quantity) {
          toast.error("You can't add more than 12 strawberries")
          return;
        }
        setSelectedToppings((prev) => [...prev.slice(0, index), { value, quantity }, ...prev.slice(index + 1)]);
        setMaxStrawberry((prev) => prev + (strawberry.quantity - quantity));

      } else {
        if (quantity > maxStrawberry) {
          toast.error("You can't add more than 12 strawberries")
          return;
        }
        setSelectedToppings((prev) => [...prev, { value, quantity }]);
        setMaxStrawberry((prev) => prev - quantity);
      }

    }
  }

  const [cakeShape, setCakeShape] = useState<string>('');
  const [cakeSize, setCakeSize] = useState<string>('');
  const [toppings, setToppings] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (queryShapes.isFetched && queryShapes?.data && queryShapes.data.length > 0) {
      setCakeShape(queryShapes.data[0].id);
    }
    if (querySizes.isFetched && querySizes?.data && querySizes.data.length > 0) {
      setCakeSize(querySizes.data[0].id);
    }
  }, [queryShapes.isFetched, querySizes.isFetched, queryShapes.data, querySizes.data]);

  useEffect(() => {
    setToppings(
      selectedToppings.flatMap((topping) => Array(topping.quantity).fill(topping.value))
    );
  }, [selectedToppings]);


  const { status, data } = useQuery({
    queryKey: ["getPrice", { cakeShape, cakeSize, toppings, message }],
    queryFn: () => getCakePrice({ cakeShapeId: cakeShape, cakeSizeId: cakeSize, toppingIds: toppings, message }),
    enabled: true,
    retry: 1,
  })
  const { mutate, status: orderCreateStatus } = useMutation({
    mutationFn: (data: CakeOrder) => createOrder(data),
    onSuccess() {
      toast.success("Order created successfully")
    },
    onError(error: any) {
      if (Array.isArray((error as any).response.data.error)) {
        (error as any).response.data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        toast.error((error as any).response.data.message, {
          position: 'top-right',
        });
      }
    },
  }
  );
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    mutate({ cakeShapeId: cakeShape, cakeSizeId: cakeSize, toppingIds: toppings, message });
  }
  return (
    <section id={CONTENT.id} className="dark:bg-gray-800 bg-white relative overflow-hidden w-screen h-screen">
      <nav className="h-24 sm:h-32 flex items-center z-30 w-full">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
            {CONTENT.logo}
          </div>
          <div className="flex items-center">
            <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
              <button onClick={() => query.refetch()} className="py-2 px-6 flex bg-transparent border-blue-400">
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
          {queryShapes.isLoading && <Loader />}
          {queryShapes.isFetched &&
            <select onChange={(e) => setCakeShape(e.target.value)} id="cake-shape" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {queryShapes.data?.map((shape: any) => (
                <option key={shape.id} value={shape.id}>{shape.shape}</option>
              ))}
            </select>
          }
        </div>
        <div className="mb-6">
          <label htmlFor="cake-size" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{CONTENT.sizeOfTheCake}</label>
          {querySizes.isLoading && <Loader />}
          {querySizes.isFetched &&
            <select onChange={(e) => setCakeSize(e.target.value)} id="cake-size" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {querySizes.data?.map((size: any) => (
                <option key={size.id} value={size.id}>{size.size}</option>
              ))}
            </select>
          }
        </div>
        <div className="mb-6">
          <label htmlFor="cake-topping" className="block text-xl text-center justify-center mb-4 font-medium text-gray-900 dark:text-white">{CONTENT.toppingsForTheCake}</label>
          {queryToppings.isLoading && <Loader />}
          {queryToppings.isFetched &&
            queryToppings.data?.map((topping, index) => (
              <div className="flex justify-between mb-2" key={index}>
                <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{topping.label}</label>
                <input
                  className="bg-gray-700 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  min="0"
                  step="4"
                  max={12}
                  defaultValue={topping.quantity}
                  onChange={event => handleQuantityChange(topping.value, Number(event.target.value))}
                  onKeyPress={(e) => e.preventDefault()}
                  value={selectedToppings.find((selectedTopping) => selectedTopping.value === topping.value)?.quantity || 0}
                />
              </div>
            ))}
        </div>


        <div className="mb-6">
          <label htmlFor="message" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">{CONTENT.message}</label>
          <input value={message} onChange={(e) => setMessage(e.target.value)} maxLength={20} type="text" id="message" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="mb-6 flex gap-11">
          <h4 className="">Price: </h4>
          {status === "pending" && <Loader />}
          {status === "success" && <h4>{((data as any).price).toString() ?? ""}</h4>}
        </div>

        <button disabled={orderCreateStatus === "pending"} onClick={handleSubmit} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </section>

  )
}

export default NewOrder;