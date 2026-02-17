import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { spacing } from '@/src/design-system';

type Props = {
  noteCount: number;
  size?: number;
};

const jarSources = {
  0: require('../../../assets/images/illustrations/jar-0-notes.png'),
  1: require('../../../assets/images/illustrations/jar-1-note.png'),
  2: require('../../../assets/images/illustrations/jar-2-notes.png'),
  3: require('../../../assets/images/illustrations/jar-3-notes.png'),
  4: require('../../../assets/images/illustrations/jar-4-notes.png'),
  5: require('../../../assets/images/illustrations/jar-5-notes.png'),
  6: require('../../../assets/images/illustrations/jar-6-notes.png'),
  full: require('../../../assets/images/illustrations/jar-full.png'),
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
