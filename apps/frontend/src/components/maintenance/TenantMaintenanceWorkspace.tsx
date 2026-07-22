import React from 'react';
import { AlertCircle, ClipboardList, Loader2, PlusCircle } from 'lucide-react';
import {
  CreateMaintenanceRequestFormData,
  MaintenanceRequest,
} from '../../types';
import {
  formatDate,
  priorityClasses,
  statusClasses,
} from './maintenanceViewUtils';

interface TenantMaintenanceWorkspaceProps {
  firstName?: string;
  requests: MaintenanceRequest[];
  formValues: CreateMaintenanceRequestFormData;
  isLoadingRequests: boolean;
  isSubmitting: boolean;
  loadError: string | null;
  submitError: string | null;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const TenantMaintenanceWorkspace: React.FC<TenantMaintenanceWorkspaceProps> = ({
  firstName,
  requests,
  formValues,
  isLoadingRequests,
  isSubmitting,
  loadError,
  submitError,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
            Tenant Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            Maintenance requests for {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Report issues, track progress, and keep a clean record of what has
            been fixed in your unit.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-900 px-5 py-4 text-white shadow-lg">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-300">
            Open Requests
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {requests.filter(request => request.status === 'open').length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <section className="card overflow-hidden border-primary-100 shadow-md">
          <div className="card-header border-b border-primary-100 bg-gradient-to-r from-primary-50 to-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-100 p-2 text-primary-700">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Submit a new request
                </h2>
                <p className="text-sm text-gray-600">
                  Give your property team the details they need to act quickly.
                </p>
              </div>
            </div>
          </div>

          <div className="card-content pt-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={onChange}
                  className="input"
                  placeholder="Leaky faucet in kitchen"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="propertyUnitIdentifier"
                >
                  Property / Unit
                </label>
                <input
                  id="propertyUnitIdentifier"
                  name="propertyUnitIdentifier"
                  value={formValues.propertyUnitIdentifier}
                  onChange={onChange}
                  className="input"
                  placeholder="Unit 2B"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="priority"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formValues.priority}
                  onChange={onChange}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={onChange}
                  className="input min-h-[140px] resize-y py-3"
                  placeholder="Share what is happening, when it started, and anything that helps the team reproduce the issue."
                  required
                />
              </div>

              {submitError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn-md w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting request...
                  </>
                ) : (
                  'Submit maintenance request'
                )}
              </button>
            </form>
          </div>
        </section>

        <section className="card overflow-hidden shadow-md">
          <div className="card-header border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2 text-gray-700">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  My requests
                </h2>
                <p className="text-sm text-gray-600">
                  Your newest requests appear first, with status and completion
                  history.
                </p>
              </div>
            </div>
          </div>

          <div className="card-content pt-6">
            {isLoadingRequests ? (
              <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading your maintenance requests...
                </div>
              </div>
            ) : loadError ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 text-center">
                <AlertCircle className="h-8 w-8 text-rose-500" />
                <p className="mt-3 text-sm font-medium text-rose-700">
                  We could not load your requests.
                </p>
                <p className="mt-1 text-sm text-rose-600">{loadError}</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                <ClipboardList className="h-10 w-10 text-gray-400" />
                <p className="mt-4 text-sm font-medium text-gray-900">
                  No maintenance requests yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  When you submit your first issue, it will appear here with its
                  current status and timestamps.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(request => (
                  <article
                    key={request._id}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.title}
                          </h3>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses[request.status]}`}
                          >
                            {request.status}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityClasses[request.priority]}`}
                          >
                            {request.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {request.description}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                        <div>
                          <p className="font-medium text-gray-800">
                            Property / Unit
                          </p>
                          <p>{request.propertyUnitIdentifier}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Created</p>
                          <p>{formatDate(request.createdAt)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Completed
                          </p>
                          <p>{formatDate(request.completedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TenantMaintenanceWorkspace;
