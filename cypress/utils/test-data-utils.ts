export const randomiseData = (prefix: string): string => {
    return `${prefix}${Math.floor(Math.random() * 100)}`;
}