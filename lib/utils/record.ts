export function getByPath(obj: Record<string, any>, path: string): any {
  return path.split('/').reduce((acc, key) => acc?.[key], obj);
}

export function setByPath(obj: Record<string, any>, path: string, value: any): Record<string, any> {
  const keys = path.split('/');
  const newObj = { ...obj }; // shallow clone
  let current: any = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] }; // clone each nested level
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
}
