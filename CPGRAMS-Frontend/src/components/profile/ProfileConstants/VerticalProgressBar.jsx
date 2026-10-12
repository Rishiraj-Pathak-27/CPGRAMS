"use client";
import { ArrowLeft } from "lucide-react";

const VerticalProgressBar = ({
  steps,
  activeStep,
  setActiveStep,
  title = "Progress",
  className = "",
  progressLineStyle = {},
}) => {
 

  return (
    <div
      className={`w-full md:w-64 bg-blue-800 text-white flex flex-col items-center py-6 md:py-10 relative overflow-hidden ${className}`}
    >
      <a href="/">
        <button className="absolute top-4 left-4 flex gap-1 items-center text-gray-900 cursor-pointer transition-colors duration-200 bg-gray-100 px-2 py-1 rounded-lg text-sm">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </a>

      <h2 className="text-xl md:text-3xl font-bold mb-8 md:mb-14 text-center mt-8 md:mt-0 px-4">
        {title}
      </h2>

      {/*progress bar code below*/}
      <div className="relative flex flex-col items-start space-y-8 md:space-y-12 w-full px-4 md:pl-8 min-w-0">
        <div
          className="absolute top-0 left-8 md:left-12 w-2 z-0 bg-blue-400"
          style={progressLineStyle}
        />

        {steps.map((step, index) => (
          <StepCircle
            key={step.id}
            label={step.label}
            active={step.id === activeStep}
            number={step.number || index + 1}
            onClick={() => setActiveStep(step.id)}
            icon={step.icon}
          />
        ))}
      </div>
    </div>
  );
};

{
  /* progress bar step circle code below*/
}

const StepCircle = ({ label, active, number, onClick, icon: Icon }) => (
  <div className="relative flex items-center z-10 max-w-full">
    <button
      onClick={onClick}
      className={`z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-110 ${
        active
          ? "bg-white border-white text-blue-600 shadow-lg"
          : "bg-blue-600 border-blue-400 text-white hover:bg-blue-500 hover:border-blue-300"
      }`}
    >
      {Icon && active ? (
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <span className="text-xs md:text-sm font-bold">{number}</span>
      )}
    </button>

    <button
      onClick={onClick}
      className={`ml-3 md:ml-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 hover:text-white cursor-pointer ${
        active ? "text-white" : "text-blue-200"
      }`}
    >
      {label}
    </button>
  </div>
);

export default VerticalProgressBar;
