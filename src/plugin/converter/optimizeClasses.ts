
export function optimizeClasses(classes: string[]) {
  const paddinX = classes
    .filter((c) => c.startsWith("pl-") || c.startsWith("pr-"))
    .map((c) => c.split("-")[1]);
  if (paddinX.length === 2 && paddinX[0] === paddinX[1]) {
    classes = classes.filter(
      (c) => !c.startsWith("pl-") && !c.startsWith("pr-")
    );
    classes.push(`px-${paddinX[0]}`);
  }

  const paddinY = classes
    .filter((c) => c.startsWith("pt-") || c.startsWith("pb-"))
    .map((c) => c.split("-")[1]);
  if (paddinY.length === 2 && paddinY[0] === paddinY[1]) {
    classes = classes.filter(
      (c) => !c.startsWith("pt-") && !c.startsWith("pb-")
    );
    classes.push(`py-${paddinY[0]}`);
  }

  const paddingAll = classes
    .filter((c) => c.startsWith("px-") || c.startsWith("py-"))
    .map((c) => c.split("-")[1]);
  if (paddingAll.length === 2 && paddingAll[0] === paddingAll[1]) {
    classes = classes.filter(
      (c) => !c.startsWith("px-") && !c.startsWith("py-")
    );
    classes.push(`p-${paddingAll[0]}`);
  }

  const borderRadiusAll = classes
    .filter((c) => c.startsWith("rounded-"))
    .map((c) => {
      const splited = c.split("-");
      return splited[splited.length - 1];
    });
  if (borderRadiusAll.length === 5) {
    const [a, tl, tr, br, bl] = borderRadiusAll;
    if (a === tl && tl === tr && tr === br && br === bl) {
      classes = classes.filter((c) => !c.startsWith("rounded-"));
      classes.push(`rounded-${a}`);
    }
  }

  return classes;
}
