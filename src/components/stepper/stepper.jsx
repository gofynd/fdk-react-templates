import React from "react";
import * as styles from "./stepper.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

export default function Stepper({
  icon = "checkmark-xs",
  steps = [],
  currentStepIdx = 1,
  customStepperClass = "",
  customStepItemClass = "",
  onStepClick,
}) {
  const getStepStatus = (idx) => {
    if (idx < currentStepIdx) {
      return "completed";
    } else if (idx === currentStepIdx) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  const handleStepClick = (event, index, step) => {
    // Prevent event bubbling
    event?.preventDefault?.();
    event?.stopPropagation?.();
    
    // Only allow clicks on completed steps
    if (index < currentStepIdx && typeof onStepClick === "function") {
      try {
        onStepClick(index, step);
      } catch (error) {
        console.error("Error in onStepClick handler:", error);
      }
    }
  };

  const isStepClickable = (index) => {
    return index < currentStepIdx && typeof onStepClick === "function";
  };

  return (
    <div className={`${styles.stepper} ${customStepperClass}`}>
      <div className={styles.stepperContainer}>
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const clickable = isStepClickable(index);
          
          return (
            <div
              key={step.label}
              className={`${styles.stepItem} ${customStepItemClass} ${
                clickable ? styles.clickable : ""
              }`}
            >
              <div
                className={styles.stepContent}
                onClick={clickable ? (e) => handleStepClick(e, index, step) : undefined}
              >
                <div
                  className={`${styles.stepIndicator} ${styles[stepStatus]}`}
                >
                  {index < currentStepIdx ? (
                    <SvgWrapper svgSrc={icon} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`${styles.stepLabel} ${styles[stepStatus]}`}
                >
                  {step.label}
                </span>
              </div>

              <div
                className={`${styles.stepConnector} ${
                  index < currentStepIdx ? styles.completed : ""
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
