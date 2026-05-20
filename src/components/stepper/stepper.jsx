import React from "react";
import * as styles from "./stepper.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

export default function Stepper({
  icon = "checkmark-xs",
  steps = [],
  currentStepIdx = 1,
  customStepperClass = "",
  customStepItemClass = "",
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

  return (
    <div className={`${styles.stepper} ${customStepperClass}`}>
      <div className={styles.stepperContainer}>
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={`${styles.stepItem} ${customStepItemClass}`}
          >
            <div className={styles.stepContent}>
              <div
                className={`${styles.stepIndicator} ${styles[getStepStatus(index)]}`}
              >
                {index < currentStepIdx ? (
                  <SvgWrapper svgSrc={icon} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`${styles.stepLabel} ${styles[getStepStatus(index)]}`}
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
        ))}
      </div>
    </div>
  );
}
