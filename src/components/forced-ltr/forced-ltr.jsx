import React from "react";

export default function ForcedLtr({ text, className = "", style = {} }) {
  return (
    <span dir="ltr" className={className} style={style}>
      {text}
    </span>
  );
}
