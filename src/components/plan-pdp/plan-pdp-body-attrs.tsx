"use client";

import { useEffect } from "react";

type PlanPdpBodyAttrsProps = {
  productFamily: string;
};

export function PlanPdpBodyAttrs({ productFamily }: PlanPdpBodyAttrsProps) {
  useEffect(() => {
    const body = document.body;
    const prevFamily = body.getAttribute("data-product-family");
    const prevSection = body.getAttribute("data-section");
    body.setAttribute("data-product-family", productFamily);
    body.setAttribute("data-section", "plans");

    return () => {
      if (prevFamily === null) body.removeAttribute("data-product-family");
      else body.setAttribute("data-product-family", prevFamily);
      if (prevSection === null) body.removeAttribute("data-section");
      else body.setAttribute("data-section", prevSection);
    };
  }, [productFamily]);

  return null;
}
