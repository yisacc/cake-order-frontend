import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import { getMeFn } from '~/api/auth-api';

type PrivateRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

const RequireAuth = ({
  children,
  redirectTo = '/signin',
}: PrivateRouteProps) => {
  const [cookies] = useCookies(['logged_in']);

  const {
    isLoading,
    isFetching,
    data: user,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: () => getMeFn(),
    enabled: !!cookies.logged_in,
    select: (data) => data.data.user,
  });

  const loading = isLoading || isFetching;

  if (loading) {
    return <div> Loading...</div>;
  }

  return (user || cookies.logged_in) ? (
    (children as React.ReactElement)
  ) : (
    <Navigate to={redirectTo} />
  );
};

export default RequireAuth;