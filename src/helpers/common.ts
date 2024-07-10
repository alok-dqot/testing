const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getPublicUrl = (fileName?: string) => {
  if (!fileName || fileName.toLowerCase() == 'na') return false
  return fileName
}

export const isImage = (fileName: string) => fileName && fileName != 'NA'

export function ordinal_suffix_of(i: number) {
  var j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) {
    return i + 'st'
  }
  if (j == 2 && k != 12) {
    return i + 'nd'
  }
  if (j == 3 && k != 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export const handleObjectChange =
  <T>(state: any, prevState?: any) =>
    (key: keyof T, value: any) => {
      if (prevState) {
        console.log('value: ', value)
        console.log('key: ', key)
        const newValue = {
          ...prevState,
          [key]: value
        }
        state(newValue)
        console.log('newValue: ', newValue)
        return newValue
      }

      state((prev: any) => ({
        ...prev,
        [key]: value
      }))
    }

export const onOfGenrate = <T extends Array<any>>(list: T, filter?: [keyof T[number], any]) => {
  return list
    .filter(f =>
      filter?.length ? (Array.isArray(filter[1]) ? !filter[1].includes(f[filter[0]]) : f[filter[0]] != filter[1]) : f
    )
    .map((item: any) => ({
      value: item.id,
      label: item.name
    }))
}

export function removeElementByIndex<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index)
}

// call the function only on no ball or previous ball case
export function PrevBall(ball: { ball: number }) {
  if (!ball) {
    return 0.1
  }
  // @ts-ignore
  let prevBall = +(parseFloat(ball.ball) - 0.1).toFixed(1)

  if (prevBall === 0) return +`0.0`

  let overList = `${prevBall}`.split('.').map(Number)

  if (overList.length === 1) {
    return +`${overList[0] - 1}.6`
  }

  if (overList[1] == 9 || overList[1] == 0) {
    overList[1] = 6
  }
  return +overList.join('.')
}
