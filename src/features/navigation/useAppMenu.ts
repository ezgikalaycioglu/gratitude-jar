import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useRouter } from 'expo-router';

import { useAuth } from '@/src/features/auth/useAuth';

const seeAllActionIndex = 0;
const calendarActionIndex = 1;
const profileActionIndex = 2;
const logoutActionIndex = 3;
const cancelActionIndex = 4;

type AppMenuScreen = 'home' | 'notes' | 'calendar' | 'profile';

type UseAppMenuParams = {
  totalCount: number;
  currentScreen: AppMenuScreen;
};

export function useAppMenu({ totalCount, currentScreen }: UseAppMenuParams) {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { signOut } = useAuth();

  const openMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: [`See all notes · ${totalCount}`, 'Calendar view', 'Profile', 'Log out', 'Cancel'],
        cancelButtonIndex: cancelActionIndex,
        destructiveButtonIndex: logoutActionIndex,
      },
      async (selectedIndex) => {
        if (selectedIndex === seeAllActionIndex) {
          if (currentScreen !== 'notes') {
            router.push('/(app)/notes');
          }

          return;
        }

        if (selectedIndex === calendarActionIndex) {
          if (currentScreen !== 'calendar') {
            router.push('/(app)/calendar');
          }

          return;
        }

        if (selectedIndex === profileActionIndex) {
          if (currentScreen !== 'profile') {
            router.push('/(app)/profile');
          }

          return;
        }

        if (selectedIndex !== logoutActionIndex) {
          return;
        }

        const logoutError = await signOut();

        if (logoutError) {
          Alert.alert('Log out failed', logoutError);
          return;
        }

        router.replace('/(auth)/login');
      },
    );
  }, [currentScreen, router, showActionSheetWithOptions, signOut, totalCount]);

  return { openMenu };
}
