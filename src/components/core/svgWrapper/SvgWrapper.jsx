import React from "react";
import { svgTitleComponentsMappings } from "../../../constants/svgTitleComponentsMappings";
function SvgWrapper({ svgSrc, children = undefined, ...props }) {
  const SvgComponent = svgTitleComponentsMappings[svgSrc];
  return SvgComponent ? (
    <SvgComponent {...props}> {children} </SvgComponent>
  ) : (
    <></>
  );
}

export default SvgWrapper;
