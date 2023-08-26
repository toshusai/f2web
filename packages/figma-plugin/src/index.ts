export function figmaNodeToJson(node: SceneNode) {
  const obj = {
    name: node.name,
    parentId: node.parent?.id,
    type: node.type,
    id: node.id,
    children:
      "children" in node
        ? node.children.map((child) => figmaNodeToJson(child))
        : [],
    componentPropertyReferences:
      "componentPropertyReferences" in node
        ? node.componentPropertyReferences
        : [],
    lineHeight: "lineHeight" in node ? node.lineHeight : null,
    fontSize: "fontSize" in node ? node.fontSize : null,
    fontName: "fontName" in node ? node.fontName : null,
    fontWeight: "fontWeight" in node ? node.fontWeight : null,
    fills: "fills" in node ? node.fills : null,
    cornerRadius: "cornerRadius" in node ? node.cornerRadius : null,
    topLeftRadius: "topLeftRadius" in node ? node.topLeftRadius : null,
    topRightRadius: "topRightRadius" in node ? node.topRightRadius : null,
    bottomLeftRadius: "bottomLeftRadius" in node ? node.bottomLeftRadius : null,
    bottomRightRadius:
      "bottomRightRadius" in node ? node.bottomRightRadius : null,
    strokeWeight: "strokeWeight" in node ? node.strokeWeight : null,
    strokeAlign: "strokeAlign" in node ? node.strokeAlign : null,
    strokeCap: "strokeCap" in node ? node.strokeCap : null,
    layoutAlign: "layoutAlign" in node ? node.layoutAlign : null,
    primaryAxisSizingMode:
      "primaryAxisSizingMode" in node ? node.primaryAxisSizingMode : null,
    counterAxisSizingMode:
      "counterAxisSizingMode" in node ? node.counterAxisSizingMode : null,
    layoutGrow: "layoutGrow" in node ? node.layoutGrow : null,
    layoutMode: "layoutMode" in node ? node.layoutMode : null,
    layoutSizingHorizontal:
      "layoutSizingHorizontal" in node ? node.layoutSizingHorizontal : null,
    layoutSizingVertical:
      "layoutSizingVertical" in node ? node.layoutSizingVertical : null,
    maxWidth: "maxWidth" in node ? node.maxWidth : null,
    characters: "characters" in node ? node.characters : null,
    maxHeight: "maxHeight" in node ? node.maxHeight : null,
    width: "width" in node ? node.width : null,
    y: "y" in node ? node.y : null,
    x: "x" in node ? node.x : null,
    height: "height" in node ? node.height : null,
    minWidth: "minWidth" in node ? node.minWidth : null,
    minHeight: "minHeight" in node ? node.minHeight : null,
    constraints: "constraints" in node ? node.constraints : null,
    clipsContent: "clipsContent" in node ? node.clipsContent : null,
    counterAxisAlignItems:
      "counterAxisAlignItems" in node ? node.counterAxisAlignItems : null,
    primaryAxisAlignItems:
      "primaryAxisAlignItems" in node ? node.primaryAxisAlignItems : null,
    strokes: "strokes" in node ? node.strokes : null,
    componentPropertyDefinitions:
      "componentPropertyDefinitions" in node && node.type === "COMPONENT_SET"
        ? node.componentPropertyDefinitions
        : null,
    paddingLeft: "paddingLeft" in node ? node.paddingLeft : null,
    paddingRight: "paddingRight" in node ? node.paddingRight : null,
    paddingTop: "paddingTop" in node ? node.paddingTop : null,
    paddingBottom: "paddingBottom" in node ? node.paddingBottom : null,
    layoutPositioning:
      "layoutPositioning" in node ? node.layoutPositioning : null,
    top: "top" in node ? node.top : null,
    bottom: "bottom" in node ? node.bottom : null,
    left: "left" in node ? node.left : null,
    right: "right" in node ? node.right : null,
    corderRadius: "corderRadius" in node ? node.corderRadius : null,
    overflow: "overflow" in node ? node.overflow : null,
    itemSpacing: "itemSpacing" in node ? node.itemSpacing : null,
  };
  return obj;
}
