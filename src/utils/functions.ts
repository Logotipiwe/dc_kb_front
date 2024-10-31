export function imgSrc(src: string){
    return process.env.PUBLIC_URL + "/" + src;
}

export function fmt(value: number|string|null|undefined){
    if(!value) return value;
    return value.toLocaleString().replaceAll(","," ")
}

export function fmtBalance(value?: number|null){
    if(!value) return value;
    if(Math.abs(value) > 9999){
        return Math.round(value / 1000) + "к";
    } else {
        return value.toLocaleString().replaceAll(",", " ")
    }
}