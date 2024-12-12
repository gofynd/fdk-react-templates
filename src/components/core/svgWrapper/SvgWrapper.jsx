/**
 * SvgWrapper is a React component that dynamically renders an SVG component based on the provided `svgSrc`.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.svgSrc - The source key used to map to a specific SVG component.
 * @param {React.ReactNode} [props.children=undefined] - Optional children elements to be rendered inside the SVG component.
 * @param {...Object} props - Additional properties to be passed to the SVG component.
 *
 * @returns {JSX.Element} - Returns the corresponding SVG component if found, otherwise returns an empty fragment.
 *
 */

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
