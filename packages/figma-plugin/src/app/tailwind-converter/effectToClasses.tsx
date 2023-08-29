export function effectToClasses(props: any) {
  const classes: string[] = [];
  if (props.boxShadow !== undefined) {
    const value = props.boxShadow.replace(/ /g, "_");
    classes.push(`shadow-[${value}]`);
  }
  return classes;
}
