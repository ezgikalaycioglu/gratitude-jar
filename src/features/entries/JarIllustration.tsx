import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { spacing } from '@/src/design-system';

type Props = {
  noteCount: number;
  size?: number;
};

const jarSources = {
  0: require('../../../assets/images/illustrations/jar-0-notes.svg'),
  1: require('../../../assets/images/illustrations/jar-1-note.svg'),
  2: require('../../../assets/images/illustrations/jar-2-notes.svg'),
  3: require('../../../assets/images/illustrations/jar-3-notes.svg'),
  4: require('../../../assets/images/illustrations/jar-4-notes.svg'),
  5: require('../../../assets/images/illustrations/jar-5-notes.svg'),
  6: require('../../../assets/images/illustrations/jar-6-notes.svg'),
  full: require('../../../assets/images/illustrations/jar-full.svg'),
} as const;

function sourceForCount(noteCount: number) {
  if (noteCount <= 0) {
    return jarSources[0];
  }

  if (noteCount === 1) {
    return jarSources[1];
  }

  if (noteCount === 2) {
    return jarSources[2];
  }

  if (noteCount === 3) {
    return jarSources[3];
  }

  if (noteCount === 4) {
    return jarSources[4];
  }

  if (noteCount === 5) {
    return jarSources[5];
  }

  if (noteCount === 6) {
    return jarSources[6];
  }

  return jarSources.full;
}

export function JarIllustration({ noteCount, size = spacing.xxl * 2 }: Props) {
  return (
    <Image
      contentFit="contain"
      source={sourceForCount(noteCount)}
      style={[styles.image, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'flex-start',
  },
});
