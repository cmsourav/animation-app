import { ViewStyle } from 'react-native';

export interface CustomBottomSheetProps {
  
  message?: string;
  backgroundColor?: string;
  dotColor?: string;
  activeDotColor?: string;
  dotSize?: number;
  animationDuration?: number;
  containerStyle?: ViewStyle;
  onAnimationComplete?: () => void;
  onCompleted?: () => void;
  autoStart?: boolean;
  stopAfter?: number;
}

export interface DotStyle {
  width: number;
  height: number;
  borderRadius: number;
  marginHorizontal: number;
} 