import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { logoutUserFn } from "~/api/auth-api";
import CONTENT from "~/data/dashbord-data";
import useQueryEvents from "~/lib/query-wrapper";

const Dashboard = () => {
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
  return (
    <section id={CONTENT.id} className="dark:bg-gray-800 bg-white relative overflow-hidden w-screen h-screen">
      <nav className="h-24 sm:h-32 flex items-center z-30 w-full">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
            {CONTENT.logo}
          </div>
          <div className="flex items-center">
            <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
              <button onClick={() => {
                query.refetch();
              }
              }
                className="py-2 px-6 flex bg-transparent border-blue-400">
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
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-5xl text-white font-bold mb-8 animate-pulse">
          {CONTENT.youAreAlmostThere}
        </h1>
        <p className="text-white text-lg mb-8">
          {CONTENT.description}
        </p>
        <a
          href={CONTENT.link}
          style={{ boxShadow: "10px 10px #b57bff" }}
          className="text-3xl shadow-solid-primary
               border-2 border-black py-6 px-4
               transition-colors ease-out
               duration-500 text-white
               bg-gradient-to-r
               from-gray-900 to-black
               ">
          {CONTENT.placeNewOrder}
        </a>
      </div>
    </section>
  )
}

export default Dashboard;