// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bindEverythingToThis(thisObj: any) {
  for (const key of Object.keys(thisObj)) {
    const func = thisObj[key]
    if (typeof func === 'function') {
      thisObj[key] = func.bind(thisObj)
      console.log('bindEverythingToThis', key)
    }
  }

  const prototype = Object.getPrototypeOf(thisObj)
  for (const key of Object.getOwnPropertyNames(prototype)) {
    if (key === 'constructor') continue

    const func = thisObj[key]
    if (typeof func === 'function') {
      thisObj[key] = func.bind(thisObj)
      console.log('bindEverythingToThis', key)
    }
  }
}
