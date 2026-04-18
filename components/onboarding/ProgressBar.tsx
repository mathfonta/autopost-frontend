interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center leading-tight ${
                index === currentStep ? "text-blue-600 font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-gray-200 rounded-full mt-1">
        <div
          className="absolute h-1 bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
