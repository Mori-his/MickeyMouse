import { useCallback, useState } from "react";


export const useToggle = (initial: boolean): [boolean, Function] => {
    const [open, setOpen] = useState(initial);
    return [open, useCallback(() => setOpen((status: boolean) => !status), [])];
};