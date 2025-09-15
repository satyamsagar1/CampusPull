import React, { useState } from "react";

const ValuesAndPrinciples = () => {
  const [selected, setSelected] = useState(0);

  const coreValues = [
    {
      title: "Student-First Philosophy",
      description:
        "Every decision centers around student success and growth.",
    },
    {
      title: "Collaboration",
      description:
        "We believe in connecting students, alumni, and faculty for shared opportunities.",
    },
    {
      title: "Innovation",
      description:
        "Encouraging creativity and building solutions for future challenges.",
    },
    {
      title: "Accessibility",
      description:
        "Resources and opportunities should be available for everyone.",
    },
    {
      title: "Community Growth",
      description:
        "Together we build a stronger network for careers and knowledge.",
    },
  ];

  return (
    <section className="bg-blue-50 py-12 mb-12 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Our Values & Principles 🌟
      </h2>
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-2xl font-semibold text-blue-600">
          {coreValues[selected].title}
        </h3>
        <p className="text-gray-600 max-w-2xl text-center">
          {coreValues[selected].description}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          {coreValues.map((value, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`px-4 py-2 rounded-full text-sm ${
                selected === index
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 shadow"
              }`}
            >
              {value.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesAndPrinciples;
