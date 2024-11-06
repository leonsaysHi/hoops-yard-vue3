import cloneDeep from 'clone-deep'

export const deepClone = (obj: {}): {} => {
  return cloneDeep(obj)
}

export const checkNumber = (n: any): number => {
  return isNaN(Number(n)) ? 0 : Number(n)
}

export const cleanPayload = (payload: any): any => {
  return Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null && v != undefined))
}
