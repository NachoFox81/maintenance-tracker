import { useState } from 'react';

const useMaintenanceFilters = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return {
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    handleResetFilters,
  };
};

export default useMaintenanceFilters;
