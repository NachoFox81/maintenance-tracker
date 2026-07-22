import { beforeEach, describe, expect, it, vi } from 'vitest';

const createMock = vi.fn();
const findByIdMock = vi.fn();
const findByIdAndDeleteMock = vi.fn();
const userFindByIdMock = vi.fn();

vi.mock('../models/MaintenanceRequest', () => ({
  MaintenanceRequestModel: {
    create: createMock,
    findById: findByIdMock,
    findByIdAndDelete: findByIdAndDeleteMock,
  },
}));

vi.mock('../models/User', () => ({
  UserModel: {
    findById: userFindByIdMock,
  },
}));

describe('MaintenanceRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires an authenticated tenant to create a request', async () => {
    const { MaintenanceRequestService } = await import(
      './maintenanceRequestService'
    );
    const service = new MaintenanceRequestService();

    await expect(
      service.createRequest('', {
        title: 'Leaky faucet',
        description: 'Water dripping',
        priority: 'normal',
        propertyUnitIdentifier: 'Unit 2B',
      })
    ).rejects.toMatchObject({
      message: 'Authenticated tenant is required',
      statusCode: 401,
    });
  });

  it('creates a request with tenant ownership and open status', async () => {
    const { MaintenanceRequestService } = await import(
      './maintenanceRequestService'
    );
    const service = new MaintenanceRequestService();

    createMock.mockResolvedValue({ _id: 'request-1' });

    await service.createRequest('tenant-1', {
      title: 'Leaky faucet',
      description: 'Water dripping',
      priority: 'high',
      propertyUnitIdentifier: 'Unit 2B',
    });

    expect(createMock).toHaveBeenCalledWith({
      title: 'Leaky faucet',
      description: 'Water dripping',
      priority: 'high',
      propertyUnitIdentifier: 'Unit 2B',
      createdBy: 'tenant-1',
      status: 'open',
    });
  });

  it('rejects assignment to tenants', async () => {
    const { MaintenanceRequestService } = await import(
      './maintenanceRequestService'
    );
    const service = new MaintenanceRequestService();

    findByIdMock.mockResolvedValue({
      _id: 'request-1',
    });
    userFindByIdMock.mockResolvedValue({
      _id: 'user-1',
      role: 'tenant',
    });

    await expect(
      service.assignRequest('request-1', {
        assignedTo: '507f1f77bcf86cd799439011',
      })
    ).rejects.toMatchObject({
      message: 'Assigned user must be an admin or manager',
      statusCode: 400,
    });
  });

  it('rejects invalid status transitions', async () => {
    const { MaintenanceRequestService } = await import(
      './maintenanceRequestService'
    );
    const service = new MaintenanceRequestService();

    findByIdMock.mockResolvedValue({
      _id: 'request-1',
      status: 'open',
    });

    await expect(
      service.updateStatus('request-1', {
        status: 'completed',
      })
    ).rejects.toMatchObject({
      message: 'Cannot change status from open to completed',
      statusCode: 400,
    });
  });

  it('sets completedAt when moving a request to completed', async () => {
    const { MaintenanceRequestService } = await import(
      './maintenanceRequestService'
    );
    const service = new MaintenanceRequestService();

    const save = vi.fn().mockResolvedValue(undefined);
    const populate = vi.fn().mockResolvedValue({ _id: 'request-1' });
    const request = {
      _id: 'request-1',
      status: 'in-progress',
      completedAt: null,
      save,
      populate,
    };
    findByIdMock.mockResolvedValue(request);

    await service.updateStatus('request-1', {
      status: 'completed',
    });

    expect(request.status).toBe('completed');
    expect(request.completedAt).toBeInstanceOf(Date);
    expect(save).toHaveBeenCalledTimes(1);
    expect(populate).toHaveBeenCalledTimes(1);
  });

  it('throws not found when deleting a missing request', async () => {
    const { MaintenanceRequestService } = await import(
      './maintenanceRequestService'
    );
    const service = new MaintenanceRequestService();

    findByIdAndDeleteMock.mockResolvedValue(null);

    await expect(service.deleteRequest('missing-request')).rejects.toMatchObject(
      {
        message: 'Maintenance request not found',
        statusCode: 404,
      }
    );
  });
});
