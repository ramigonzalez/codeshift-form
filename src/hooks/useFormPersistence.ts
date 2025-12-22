import { useEffect, useCallback } from 'react';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormData } from '../types/application';

const STORAGE_KEY = 'ai-engineer-form-draft';
const AUTOSAVE_DELAY = 1000; // 1 second debounce

interface UseFormPersistenceProps {
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

/**
 * Hook to persist form data to localStorage
 * Automatically saves form changes and restores on mount
 */
export const useFormPersistence = ({ watch, setValue }: UseFormPersistenceProps) => {
  // Load saved data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as Partial<FormData>;

        // Restore all saved fields
        Object.entries(parsed).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Skip File objects (they can't be serialized)
            if (key !== 'cv') {
              setValue(key as keyof FormData, value as any);
            }
          }
        });

        console.log('Form data restored from localStorage');
      }
    } catch (error) {
      console.error('Failed to restore form data:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setValue]);

  // Save form data on changes (debounced)
  useEffect(() => {
    let timeoutId: number;

    const subscription = watch((formData) => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout for autosave
      timeoutId = setTimeout(() => {
        try {
          // Create a copy without File objects (they can't be serialized)
          const dataToSave: any = { ...formData };
          delete dataToSave.cv;

          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
          console.log('Form data auto-saved to localStorage');
        } catch (error) {
          console.error('Failed to save form data:', error);
        }
      }, AUTOSAVE_DELAY) as unknown as number;
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [watch]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Saved form data cleared');
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, []);

  // Check if there's saved data
  const hasSavedData = useCallback((): boolean => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData !== null && savedData.length > 0;
    } catch {
      return false;
    }
  }, []);

  return {
    clearSavedData,
    hasSavedData,
  };
};
