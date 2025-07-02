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
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Plan Your Trip to Ivory Coast</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="duration" className="form-label">Duration (days)</label>
            <input
              type="number"
              className="form-control"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="budget" className="form-label">Budget ($)</label>
            <input
              type="number"
              className="form-control"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              min="100"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Generate Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlannerForm;
