import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { FormProvider, SubmitHandler, set, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TypeOf, object, string } from "zod";
import { getMeFn, loginUserFn } from "~/api/auth-api";
import { ILoginResponse, IUser } from "~/api/types";
import FormField from "~/design-system/components/FormField";
import CONTENT from "~/data/signin-data";
import delay from "~/lib/delay";
import useQueryEvents from "~/lib/query-wrapper";
import { useStateContext } from "~/providers/user-provider";

const loginSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});


export type LoginInput = TypeOf<typeof loginSchema>;

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setCookie] = useCookies(['access_token', 'refresh_token', 'logged_in']);

  const from = ((location.state as any)?.from.pathname as string) || '/dashboard';


  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const stateContext = useStateContext();


  const query = useQuery({
    queryKey: ["authUser"], queryFn: getMeFn,
    enabled: false,
    select: (data) => data.data.user,
    retry: 1,
  });
  useQueryEvents(query, {
    onSuccess: (data: IUser) => {
      stateContext.dispatch({ type: 'SET_USER', payload: data });
    }
  })

  const { mutate: loginUser, status } = useMutation<ILoginResponse, Error, LoginInput>({
    mutationFn: async (userData: LoginInput) => loginUserFn(userData),
    onSuccess: (data) => {
      setCookie('access_token', data.tokens.access.token);
      setCookie('refresh_token', data.tokens.refresh.token);
      delay(2000)
      query.refetch();
      setCookie('logged_in', true);
      toast.success('You successfully logged in');
      navigate(from);
    },
    onError: (error: any) => {
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

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className=" mr-2" src={CONTENT.Logo} alt="logo" />
          {CONTENT.title}
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {CONTENT.subTitle}
            </h1>
            <FormProvider {...methods}>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{CONTENT.email}</label>
                  <FormField
                    type="email"
                    name="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    register={register}
                    error={errors.email}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{CONTENT.password}</label>
                  <FormField
                    type="password"
                    name="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                    register={register}
                    error={errors.password}
                  />
                </div>
                <button disabled={status === "pending"} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{CONTENT.signin}</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {CONTENT.dontHaveAccount} <a href={CONTENT.signupLink} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{CONTENT.signup}</a>
                </p>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;