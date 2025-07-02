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
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold mb-4">Plan Your Trip to Ivory Coast</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">Duration (days)</label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="budget" className="block text-gray-700 font-bold mb-2">Budget ($)</label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            min="100"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          Generate Plan
        </button>
      </form>
    </div>
  );
};

export default PlannerForm;