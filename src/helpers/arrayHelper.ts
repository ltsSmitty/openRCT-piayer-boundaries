/**
 * Checks if the index is a valid index for this array.
 * @param array The array to check.
 * @param index The index to check.
 */
export function isValidIndex<T>(array: T[] | null, index: number | null): boolean {
    return (array != null && index != null && index >= 0 && index < array.length);
}


/**
 * Gets the item at the index if the index is a valid index for this array.
 * @param array The array to check.
 * @param index The index to check.
 */
export function getAtIndex<T>(array: T[] | null, index: number | null): T | null {
    return (array != null && index != null && index >= 0 && index < array.length) ? array[index] : null;
}


/**
 * Gets index of the first matching item. Returns -1 if no items match the predicate.
 * @param array The array to check.
 * @param predicate The function to match the items against.
 */
export function findIndex<T>(array: T[], predicate: (item: T) => boolean): number {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}


/**
 * Gets the first matching item. Returns null if no items match the predicate.
 * @param array The array to check.
 * @param predicate The function to match the items against.
 */
export function find<T>(array: T[], predicate: (item: T) => boolean): T | null {
    const idx = findIndex(array, predicate);
    return (idx === null) ? null : array[idx];
}


/**
 * Gets the first item of the array, or null if it has no items.
 * @param array The array to check.
 */
export function firstOrNull<T>(array: T[]): T | null {
    return (array.length > 0) ? array[0] : null;
}

export const createArrayAndFill = <T>(length: number, value: T): T[] => {
    return (new Array(length)).map(() => value);
}

/**
 * Gets [key, value] for each key in T. Functions to polyfill arrect.entries for to get missing functionality.
 * @param arr The array to get entries from.
 */
export function entries<T>(arr: { [key: string]: T }): [string, T][] {
    var ownProps = Object.keys(arr),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
        resArray[i] = [ownProps[i], arr[ownProps[i]]];

    return resArray;
};