import { useCallback, useEffect } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CVMetadata, FormData } from '../types/application';

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
            // Skip metadata fields - they're not form fields
            if (key === 'cv_metadata') {
              return;
            }
            // Skip File objects (they can't be serialized)
            if (key !== 'cv') {
              setValue(key as keyof FormData, value as any);
            }
          }
        });
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

          // Save CV metadata if file exists
          if (formData.cv instanceof File) {
            dataToSave.cv_metadata = {
              filename: formData.cv.name,
              size: formData.cv.size,
              lastModified: formData.cv.lastModified,
            };
          }

          delete dataToSave.cv;

          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
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

/**
 * Get saved CV metadata from localStorage
 */
export const getSavedCVMetadata = (): CVMetadata | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.cv_metadata || null;
    }
    return null;
  } catch {
    return null;
  }
};
