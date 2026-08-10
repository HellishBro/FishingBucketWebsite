// Source - https://stackoverflow.com/a/20339758
// Posted by qiu-deqing, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-10, License - CC BY-SA 4.0

function array_equals<T>(a: T[], b: T[], comp: (a: T, b: T) => boolean): boolean {
    if (a.length != b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
        if (!comp(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

function n2dcontains<T>(n2darray: T[][], array: T[], comp: (a: T, b: T) => boolean): boolean {
    for (let i = 0; i < n2darray.length; i++) {
        if (array_equals(n2darray[i], array, comp)) {
            return true;
        }
    }
    return false;
}

export function n2dnormalize<T>(array: T[][], comp: (a: T, b: T) => boolean): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i++) {
        if (!n2dcontains(result, array[i], comp)) {
            result.push(array[i]);
        }
    }
    return result;
}