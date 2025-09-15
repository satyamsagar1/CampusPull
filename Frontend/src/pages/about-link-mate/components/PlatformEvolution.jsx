import React from "react";

const PlatformEvolution = () => {
  const steps = [
    { year: "2024", text: "Idea born to connect students & alumni." },
    { year: "2025", text: "First prototype launched at ABESIT." },
    { year: "Future", text: "Expanding to more colleges and communities." },
  ];

  return (
    <section className="bg-white shadow-md rounded-2xl p-10 max-w-5xl mx-auto mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Platform Evolution 📈
      </h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-l-4 border-blue-500 pl-4"
          >
            <span className="text-blue-600 font-bold">{step.year}</span>
            <p className="text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlatformEvolution;
