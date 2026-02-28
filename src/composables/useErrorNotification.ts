import { notification } from 'ant-design-vue';
import { AxiosError } from 'axios';
import { FormContext } from 'vee-validate';
import { FormError } from '@/services/general';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
}

let duplicateMessage = '';

export const useErrorNotification = () => {
  const showErrorNotification = (error: unknown) => {
    console.error('Caught error:', error);

    let errorMessage = 'Unknown error occurred';

    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorResponse;
      errorMessage = apiError?.message || error.message;
      if (apiError?.errors?.length) {
        errorMessage += `: ${apiError.errors.join(', ')}`;
      }
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as ApiErrorResponse).message ?? errorMessage;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    if (errorMessage === duplicateMessage) return;

    duplicateMessage = errorMessage;

    setTimeout(() => {
      duplicateMessage = '';
    }, 2000);

    notification.error({
      message: 'Error',
      description: errorMessage,
      duration: 3,
    });
  };

  const showFormError = (formRef: FormContext, error: unknown) => {
    const err = error as FormError;
    if (!err.errors) return;
    formRef.setErrors(err.errors);
  };

  return { showErrorNotification, showFormError };
};
