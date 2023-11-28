export function purifyString(str: string) { return str.replace(/[^a-zA-Z0-9]/g, "_") }


export const getUniqueFileName = (str: string) => {
    const fileNameArr = str.split('.');
    return `${purifyString(fileNameArr[0])}_${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`;
}