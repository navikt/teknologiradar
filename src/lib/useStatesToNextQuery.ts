import { NextRouter } from "next/router";
import { useEffect, type useState } from "react";

export const eqSet = <T>(A: Set<T>, B: Set<T>) =>
  A.size === B.size && [...A].every((x) => B.has(x));

const normalizeParam = (query: URLSearchParams, param: string) => {
  const queryParsed = query[param];

  let paramsFromQuery = Array.isArray(queryParsed)
    ? (queryParsed as string[])
    : ([queryParsed] as string[]);

  paramsFromQuery = paramsFromQuery.filter(
    (x) => x !== undefined && x !== null,
  );

  return paramsFromQuery;
};

type HasChangeParams =
  | {
      key: string;
      query: URLSearchParams;
      stateValue: string | string[];
      param?: never;
    }
  | {
      key?: never;
      query?: never;
      param: string[];
      stateValue: string | string[];
    };

const hasChange = ({ key, stateValue, query, param }: HasChangeParams) => {
  let _param = param ? param : normalizeParam(query, key);
  // "" is discarded by setting it to []
  // we don't want empty strings in our query params
  let _stateValue = stateValue === "" ? [] : stateValue;
  const oldStateValues = new Set(
    Array.isArray(_stateValue) ? _stateValue : [_stateValue],
  );
  const newStateValues = new Set(_param);

  return !eqSet(oldStateValues, newStateValues);
};

type UseStateReturns<T> = ReturnType<typeof useState<T>>;

/**
 * Only supports string and string[] as the value of the useStates.
 * Hopefully most form & input needs are covered by this.
 *
 * Arrays are converted by Next Router to repeated query params with the same value.
 *
 * **NOTE: Uses the Pages router (not App)**
 *
 * @param router the router from `Next.useRouter()`
 * @param useStates a dictionary where the key is your desired query param and the value is the array returned from `React.useState()`
 */
export const useStatesToNextQuery = (
  router: NextRouter,
  useStates: Record<string, UseStateReturns<string[] | string>>, // TODO: type is too permissive
) => {
  // Set the stateValues when the URL query params change
  useEffect(() => {
    for (const [key, [stateValue, setStateValue]] of Object.entries(
      useStates,
    )) {
      if (stateValue === undefined) {
        continue;
      }

      let param = normalizeParam(router.query, key);

      if (hasChange({ stateValue, param })) {
        if (param.length > 0) {
          if (Array.isArray(stateValue)) {
            setStateValue(param);
          } else {
            setStateValue(param[0]);
          }
        }
      }
    }
  }, [router]);

  // Update the URL query params when the stateValues change
  useEffect(() => {
    for (const [key, [stateValue, setStateValue]] of Object.entries(
      useStates,
    )) {
      if (stateValue === undefined) {
        continue;
      }

      if (hasChange({ stateValue, query: router.query, key })) {
        if (stateValue === "") {
          delete router.query[key];
        } else {
          router.query[key] = stateValue;
        }

        router.replace(
          { pathname: router.pathname, query: router.query },
          undefined,
          {
            shallow: true,
          },
        );
      }
    }
  }, [useStates]);
};
