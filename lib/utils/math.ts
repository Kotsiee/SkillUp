export const normalise = (min: number, max: number, val: number):number => {
    return ( (val - min) / (max-min) )
}

export const getPercentage = (min: number, max: number, val: number):number => {
    return normalise(min, max, val) * 100
}

export const roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step;
  }