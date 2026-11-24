import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../styles/tokens';
import type { LogoProps } from '../../types/types';

const FLAG_RED = '#e5383b';

export const Logo = ({ size = 64, inverted = false }: LogoProps) => {
  const boxColor = inverted ? colors.onPrimary : colors.primary;
  const poleColor = inverted ? colors.primary : colors.onPrimary;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Rect width={512} height={512} rx={112} fill={boxColor} />
      <Rect x={164} y={96} width={26} height={320} rx={13} fill={poleColor} />
      <Path d="M190 120 H392 L348 190 L392 260 H190 Z" fill={FLAG_RED} />
      <Rect x={259} y={146} width={24} height={62} rx={12} fill={colors.onPrimary} />
      <Circle cx={271} cy={232} r={13} fill={colors.onPrimary} />
    </Svg>
  );
};
