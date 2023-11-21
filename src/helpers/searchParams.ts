import Router from "next/router";

export const clearSearchParams = () => {
  void Router.push({ pathname: Router.pathname, query: null }, undefined, {
    shallow: true,
  });
};

export const handleRouterNavigation = (
  queryParams: Record<string, string | string[] | boolean | number>,
) => {
  void Router.push(
    {
      query: {
        ...Router.query,
        ...queryParams,
      },
    },
    undefined,
    { shallow: true },
  );
};

export const handleRouterRemoveQuery = (queryToRemove: string) => {
  const { [queryToRemove]: _, ...remainingQuery } = Router.query;

  console.log("handleRouterRemoveQuery", { remainingQuery, _ });
  void Router.replace({ query: remainingQuery }, undefined, {
    shallow: true,
  });
};
