const getArrSortedByPriority = (jsn: any, filter?: string, priority = 'priority') => Object
  // [[crName, {props}], [crName, {props}], ..., [crName, {props}]]
  .entries(jsn)
  // crName starts with i && c
  .filter(([cr]) => {
    if (filter) {
      return cr.substring(0, filter.length) === filter;
    }
    if (cr === 'cs') {
      return false;
    }
    // const isCrNameValid = (crName: string): boolean => {
    //   const c = crName.substring(0, 1);
    //   const crNum = crName.substring(1, 2);
    //   return (c === 'c' || c === 'i') && typeof Number(crNum) === 'number'
    // }
    const containerName = cr.substring(0, 1);
    return (containerName === 'c' || containerName === 'i');
  })
  // sorted by priority
  .sort((a: any, b: any) => a[1].cs[priority] - b[1].cs[priority]);
  // [{ci: {props}}, {ci: {props}}, ..., {ci: {props}}]
  // .reduce((key: Array<unknown>, [cr, props]: [string, unknown]) => {
  //   key.push({ [cr]: props });
  //   return key;
  // }, [])

export default getArrSortedByPriority;
