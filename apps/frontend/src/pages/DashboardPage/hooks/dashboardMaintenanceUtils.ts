import {
  CreateMaintenanceRequestFormData,
  MaintenanceRequest,
} from '../../../types';

export const defaultFormValues: CreateMaintenanceRequestFormData = {
  title: '',
  description: '',
  priority: 'normal',
  propertyUnitIdentifier: '',
};

export const replaceRequest = (
  requests: MaintenanceRequest[],
  nextRequest: MaintenanceRequest
) =>
  requests.map(request =>
    request._id === nextRequest._id ? nextRequest : request
  );
