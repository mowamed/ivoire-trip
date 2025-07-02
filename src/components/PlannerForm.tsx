import React from 'react';

interface Props {
  onPlanRequest: (duration: number, budget: number) => void;
}

const PlannerForm: React.FC<Props> = ({ onPlanRequest }) => {
  const [duration, setDuration] = React.useState(7);
  const [budget, setBudget] = React.useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanRequest(duration, budget);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 mb-4">
      <h2 className="text-3xl font-bold text-dark mb-6">Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">Duration (days)</label>
          <input
            type="number"
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="1"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="budget" className="block text-gray-700 font-bold mb-2">Budget ($)</label>
          <input
            type="number"
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            min="100"
          />
        </div>
        <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105">
          Generate Plan
        </button>
      </form>
    </div>
  );
};

export default PlannerForm;
