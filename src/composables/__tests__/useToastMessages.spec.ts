import { describe, it, expect, vi } from 'vitest';
import { useToastMessages } from '@/composables/useToastMessages';
import { useToast } from 'primevue/usetoast';
import { toastConfig } from '@/config/toast';

vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(),
}));

describe('useToastMessages', () => {
  it('should call toast.add with success config', () => {
    const addMock = vi.fn();
    (useToast as unknown as vi.Mock).mockReturnValue({ add: addMock });

    const { showSuccess } = useToastMessages();
    const message = 'Operation was successful!';

    showSuccess(message);

    expect(addMock).toHaveBeenCalledWith({
      ...toastConfig,
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  });
});
