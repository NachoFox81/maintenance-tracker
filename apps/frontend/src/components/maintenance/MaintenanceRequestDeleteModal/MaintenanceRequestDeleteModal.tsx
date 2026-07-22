import React from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { MaintenanceRequest } from '../../../types';

interface MaintenanceRequestDeleteModalProps {
  request: MaintenanceRequest;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

const MaintenanceRequestDeleteModal: React.FC<
  MaintenanceRequestDeleteModalProps
> = ({ request, isDeleting, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl ring-1 ring-black/5">
        <div className="mb-5 inline-flex rounded-full bg-red-100 p-3 text-red-600">
          <Trash2 className="h-6 w-6" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-600">
          Confirm deletion
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          Delete this maintenance request?
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          You are about to permanently remove{' '}
          <span className="font-semibold text-gray-900">{request.title}</span>.
          This action cannot be undone.
        </p>

        <div className="mt-6 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600 ring-1 ring-gray-100">
          <p className="font-medium text-gray-900">
            {request.propertyUnitIdentifier}
          </p>
          <p className="mt-1">{request.description}</p>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep request
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestDeleteModal;
