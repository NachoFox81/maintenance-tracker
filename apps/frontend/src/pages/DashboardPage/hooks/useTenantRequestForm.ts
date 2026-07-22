import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { maintenanceService } from '../../../services/maintenanceService';
import {
  CreateMaintenanceRequestFormData,
  MaintenanceRequest,
} from '../../../types';
import { defaultFormValues } from './dashboardMaintenanceUtils';

interface UseTenantRequestFormParams {
  setRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
}

const useTenantRequestForm = ({
  setRequests,
}: UseTenantRequestFormParams) => {
  const [formValues, setFormValues] =
    useState<CreateMaintenanceRequestFormData>(defaultFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormValues(current => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const { maintenanceRequest } = await maintenanceService.createRequest(
        formValues
      );

      setRequests(current => [maintenanceRequest, ...current]);
      setFormValues(defaultFormValues);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit maintenance request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formValues,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit,
  };
};

export default useTenantRequestForm;
