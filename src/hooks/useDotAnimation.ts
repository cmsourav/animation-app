import { useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';

interface UseDotAnimationProps {
  animationDuration?: number;
  autoStart?: boolean;
  onAnimationComplete?: () => void;
  stopAfter?: number; 
}

export const useDotAnimation = ({
  animationDuration = 600,
  autoStart = true,
  onAnimationComplete,
  stopAfter,
}: UseDotAnimationProps) => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const createAnimationSequence = useCallback(() => {
    return Animated.sequence([
      // First dot active
      Animated.parallel([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]),
      // Second dot active
      Animated.parallel([
        Animated.timing(dot1Opacity, {
          toValue: 0.3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]),
      // Third dot active
      Animated.parallel([
        Animated.timing(dot1Opacity, {
          toValue: 0.3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]),
    ]);
  }, [dot1Opacity, dot2Opacity, dot3Opacity, animationDuration]);

  const startAnimation = useCallback(() => {
    try {
      const sequence = createAnimationSequence();
      animationRef.current = sequence;
      
      sequence.start((result) => {
        if (result.finished) {
          onAnimationComplete?.();
          // Only restart animation if stopAfter is not set
          if (!stopAfter) {
            startAnimation();
          }
        }
      });
    } catch (error) {
      console.error('Animation error:', error);
    }
  }, [createAnimationSequence, onAnimationComplete, stopAfter]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  }, []);

  const resetAnimation = useCallback(() => {
    dot1Opacity.setValue(0.3);
    dot2Opacity.setValue(0.3);
    dot3Opacity.setValue(0.3);
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }

    // Set timeout to stop animation if stopAfter is specified
    let timeoutId: NodeJS.Timeout | null = null;
    if (stopAfter && stopAfter > 0) {
      timeoutId = setTimeout(() => {
        stopAnimation();
      }, stopAfter);
    }

    return () => {
      stopAnimation();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [autoStart, startAnimation, stopAnimation, stopAfter]);

  return {
    dot1Opacity,
    dot2Opacity,
    dot3Opacity,
    startAnimation,
    stopAnimation,
    resetAnimation,
  };
}; 