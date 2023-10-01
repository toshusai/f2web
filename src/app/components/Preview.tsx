import React, { useEffect } from "react";
import { getReactSrc } from "../../plugin/converter/react/getReactSrc";
import { compareTreeNode } from "../../plugin/converter/compareTreeNode";
import { toCssStyleText } from "../../plugin/converter/html-css/toCssStyleText";
import { stylesToClassAttrsRecursive } from "../../plugin/converter/react/stylesToClassAttrsRecursive";
import { getReactStyledSrc } from "../../plugin/converter/react-styled/getReactStyledSrc";
import { Tabs } from "./Tabs";
import { FormatedCode } from "./FormatedCode";
import { domNodeToHtmlCssAll } from "../../plugin/converter/html-css/domNodeToHtmlCssAll";
import { Radios } from "./Radios";
import { update } from "./update";

export enum CodeType {
  Styled = "styled",
  Tailwind = "tailwind",
  Html = "html",
  Preview = "preview",
}

type Variants = {
  [key: string]: string[];
};

export function Preview(props: { message: any }) {
  const [option, setOption] = React.useState<CodeType>(CodeType.Preview);
  const { message } = props;
  // some methods will mutate the message so we need to clone it
  const { ctx, domNodes, ignoreInstancedDomNodes, bg } = JSON.parse(
    JSON.stringify(message)
  );

  const [currentVariant, setCurrentVariant] = React.useState<string>(
    ignoreInstancedDomNodes[0].name
  );

  const ignoreInstancedDomNode =
    ignoreInstancedDomNodes.find((x) => x.name === currentVariant) ||
    ignoreInstancedDomNodes[0];

  const domNode = domNodes[0];

  const variants: Variants = {};

  ignoreInstancedDomNodes.map((x) => {
    const [key, value] = x.name.split("=");

    if (!variants[key]) {
      variants[key] = [];
    }
    variants[key].push(value);
  });

  const styleInnerHtml = toCssStyleText(ctx.colors);

  if (option === CodeType.Tailwind) {
    domNodes.forEach((x) => {
      stylesToClassAttrsRecursive(x);
    });
  }
  domNodes.forEach((variantNode, i) => {
    if (i === 0) return;
    compareTreeNode(domNode, variantNode, variantNode.name);
  });

  const html = domNodeToHtmlCssAll(ignoreInstancedDomNode, ctx);

  let html2 = html;
  if (ctx.images) {
    Object.keys(ctx.images).forEach((key) => {
      const uint8 = ctx.images[key];
      const url = URL.createObjectURL(new Blob([uint8], { type: "image/png" }));
      html2 = html2.replace(new RegExp(key, "g"), url);
    });
  }

  let tailwindConfigColors = {};
  Object.keys(ctx.colors).forEach((key) => {
    tailwindConfigColors[ctx.colors[key].id] = `var(--${ctx.colors[key].id})`;
  });

  const [src, setSrc] = React.useState<string>("");
  useEffect(() => {
    let _src = "";
    if (option === CodeType.Html) {
      _src = html;
    } else if (option === CodeType.Tailwind) {
      _src = getReactSrc(domNode, ctx);
    } else if (option === CodeType.Styled) {
      _src = getReactStyledSrc(domNode, ctx);
    }
    if (src != _src) {
      setSrc(_src);
      if (!option) {
        update(message, option);
      }
    }
  }, [option, domNode, ctx]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: styleInnerHtml,
        }}
      ></style>
      <Tabs
        items={[
          {
            label: "Preview",
            value: "preview",
          },
          {
            label: "Tailwind",
            value: "tailwind",
          },
          {
            label: "Styled",
            value: "styled",
          },
          {
            label: "HTML",
            value: "html",
          },
        ]}
        active={option}
        onClick={(value) => {
          setOption(value as CodeType);
        }}
      />

      {option === CodeType.Preview ? (
        <div>
          <div
            style={{
              padding: "16px",
              height: "256px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: bg,
              borderTop: "1px solid #E0E0E0",
              borderBottom: "1px solid #E0E0E0",
              overflow: "auto",
            }}
            dangerouslySetInnerHTML={{
              __html: html2,
            }}
          ></div>
          {Object.keys(variants).map((key) => {
            if (variants[key].length === 1) return null;
            return (
              <Radios
                key={key}
                name={key}
                items={variants[key].map((x) => ({
                  label: x,
                  value: x,
                }))}
                active={currentVariant}
                onClick={(value) => {
                  setCurrentVariant(`${key}=${value}`);
                }}
              />
            );
          })}
        </div>
      ) : (
        <FormatedCode src={src} type={option} />
      )}
    </>
  );
}
