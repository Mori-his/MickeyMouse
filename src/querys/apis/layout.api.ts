import { InfiniteQueryObserverResult, useQuery } from "@tanstack/react-query";
import { api } from "@utils/axiosInstance";
import { GET_LAYOUTS, SAVE_LAYOUTS } from "./urls";




export function useQueryLayoutConfig(
    select?: (data: any) => any,
    notifyOnChangeProps?: Array<keyof InfiniteQueryObserverResult> | 'all'
) {
    const { isLoading, error, data } = useQuery({
        queryKey: ["layoutConfig"],
        queryFn: () =>
          api
            .get(GET_LAYOUTS)
            .then((res: any) => res.data),
        select: select || (data => data),
        notifyOnChangeProps: notifyOnChangeProps || ['data']
    });
}

export function useQuerySaveLayoutConfig(
    data: Object = {},
    select?: (data: any) => any,
    notifyOnChangeProps?: Array<keyof InfiniteQueryObserverResult> | 'all'
) {
    api.post(SAVE_LAYOUTS, { data });
}
