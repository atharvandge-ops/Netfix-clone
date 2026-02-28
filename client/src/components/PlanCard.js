import React from 'react';

const PlanCard = ({ plan, onSelect, isSelected }) => {
  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'ring-4 ring-red-600 transform scale-105'
          : 'hover:ring-2 hover:ring-gray-700'
      }`}
      onClick={() => onSelect(plan)}
    >
      <div className="text-center mb-6">
        <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="text-white">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300">
            <span className="text-green-500 mr-2">✓</span>
            <span>Video Quality: {plan.videoQuality}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-green-500 mr-2">✓</span>
            <span>{plan.simultaneousScreens} Screens</span>
          </div>
          {plan.features?.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-300">
              <span className="text-green-500 mr-2">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            isSelected
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
