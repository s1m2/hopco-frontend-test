import { useToast } from 'primevue/usetoast';
import { toastConfig } from '@/config/toast';

export function useToastMessages() { 
  const toast = useToast();

  function showSuccess(message: string) {
    toast.add({ ...toastConfig, severity: 'success', summary: 'Success', detail: message });
  }

  return { showSuccess };
}