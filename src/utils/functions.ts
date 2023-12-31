export function imgSrc(src: string){
    return process.env.PUBLIC_URL + "/" + src;
}

export function fmt(value: number|string|null|undefined){
    if(!value) return value;
    return value.toLocaleString().replaceAll(","," ")
}