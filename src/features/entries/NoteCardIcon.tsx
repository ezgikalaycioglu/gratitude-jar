import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { spacing } from '@/src/design-system';

type Props = {
  index: number;
  size?: number;
};

const iconSources = [
  require('../../../assets/images/illustrations/icon-sparkle.svg'),
  require('../../../assets/images/illustrations/icon-star.svg'),
  require('../../../assets/images/illustrations/icon-heart.svg'),
  require('../../../assets/images/illustrations/icon-leaf.svg'),
  require('../../../assets/images/illustrations/icon-sun.svg'),
  require('../../../assets/images/illustrations/icon-cloud.svg'),
  require('../../../assets/images/illustrations/icon-flower.svg'),
  require('../../../assets/images/illustrations/icon-ribbon.svg'),
  require('../../../assets/images/illustrations/icon-bird.svg'),
  require('../../../assets/images/illustrations/icon-moon.svg'),
  require('../../../assets/images/illustrations/icon-rainbow.svg'),
] as const;

export function NoteCardIcon({ index, size = spacing.sm + spacing.xs }: Props) {
  const source = iconSources[Math.abs(index) % iconSources.length];

  return <Image contentFit="contain" source={source} style={[styles.icon, { width: size, height: size }]} />;
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'flex-start',
  },
});
