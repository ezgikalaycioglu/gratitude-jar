import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { spacing } from '@/src/design-system';

type Props = {
  index: number;
  size?: number;
};

const iconSources = [
  require('../../../assets/images/illustrations/icon-cactus.png'),
  require('../../../assets/images/illustrations/icon-cloud.png'),
  require('../../../assets/images/illustrations/icon-flower-2.png'),
  require('../../../assets/images/illustrations/icon-flower-3.png'),
  require('../../../assets/images/illustrations/icon-flower.png'),
  require('../../../assets/images/illustrations/icon-frog.png'),
  require('../../../assets/images/illustrations/icon-star-2.png'),
  require('../../../assets/images/illustrations/icon-star.png'),
  require('../../../assets/images/illustrations/icon-strawberry.png'),
  require('../../../assets/images/illustrations/icon-sun.png'),
] as const;

export function NoteCardIcon({ index, size = spacing.sm + spacing.xs }: Props) {
  const source = iconSources[Math.abs(index) % iconSources.length];

  return (
    <Image
      contentFit="contain"
      source={source}
      style={[styles.icon, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'flex-start',
  },
});
