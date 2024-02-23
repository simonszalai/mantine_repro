// Return undefined instead of empty list so if there are no errors, the UI will display no error
export const checkErrorList = (list: any[] | undefined) => {
  return list && list.length > 0 ? list : undefined
}
