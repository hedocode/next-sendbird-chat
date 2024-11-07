import { useEffect } from "react";

/**
 * @param id The id of the localStorage item. This value may be a constant.
 * @param getter The state value itself
 * @param setter Function (callback) used to initialize the value.
 */
export function useLocalStorageSync(
    id: string,
    getter: string,
    setter: Function
) {

    // Updating the state value with the localStorage one if it exists.
    useEffect(
        () => {
            const valueFromLocalStorage = localStorage.getItem(id);
            if (valueFromLocalStorage) {
                setter(valueFromLocalStorage);
            }
        }, [id, setter]
    )

    // When the state value changed,
    useEffect(
        // it does update localStorage.
        () => localStorage.setItem(id, getter),
        [getter, id]
    )
}