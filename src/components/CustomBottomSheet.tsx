import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { CustomBottomSheetProps } from '../../types/CustomBottomSheetTypes';
import { useDotAnimation } from '../hooks/useDotAnimation';
import Feather from 'react-native-vector-icons/Feather';

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  message = 'Processing',
  backgroundColor = '#E6521F',
  dotColor = '#FFF',
  activeDotColor = '#E14434',
  dotSize = 12,
  animationDuration = 1000,
  containerStyle,
  onAnimationComplete,
  onCompleted,
  autoStart = true,
  stopAfter = 4000,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const completedOpacity = useRef(new Animated.Value(0)).current;
  const completedScale = useRef(new Animated.Value(0.8)).current;

  const { dot1Opacity, dot2Opacity, dot3Opacity } = useDotAnimation({
    animationDuration,
    autoStart,
    onAnimationComplete,
    stopAfter,
  });

  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    marginHorizontal: dotSize / 4,
  };

  // Handle transition to completed state
  useEffect(() => {
    if (stopAfter && stopAfter > 0) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
        
        // Animate loading section out
        Animated.timing(loadingOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();

        // Animate completed section in
        Animated.parallel([
          Animated.timing(completedOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(completedScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onCompleted?.();
        });
      }, stopAfter);

      return () => clearTimeout(timer);
    }
  }, [stopAfter, loadingOpacity, completedOpacity, completedScale]);

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor }, 
        containerStyle
      ]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Loading indicator: ${message}`}
    >
      {/* Loading Section - Centered */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          { opacity: loadingOpacity }
        ]}
        pointerEvents={isCompleted ? 'none' : 'auto'}
      >
        <View style={styles.loadingIndicator}>
          <Animated.View
            style={[
              styles.dot,
              dotStyle,
              { 
                opacity: dot1Opacity, 
                backgroundColor: dotColor
              },
            ]}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="First loading dot"
          />
          <Animated.View 
            style={[
              styles.dot, 
              dotStyle, 
              { 
                opacity: dot2Opacity,
                backgroundColor: dotColor 
              }
            ]}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="Second loading dot"
          />
          <Animated.View 
            style={[
              styles.dot, 
              dotStyle, 
              { 
                opacity: dot3Opacity,
                backgroundColor: dotColor 
              }
            ]}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="Third loading dot"
          />
        </View>
        <Text style={[styles.loadingText, { color: dotColor }]}>
          {message}
        </Text>
      </Animated.View>

      {/* Completed Section - Centered */}
      <Animated.View 
        style={[
          styles.completedContainer,
          { 
            opacity: completedOpacity,
            transform: [{ scale: completedScale }]
          }
        ]}
        pointerEvents={isCompleted ? 'auto' : 'none'}
      >
        <View style={styles.checkIconContainer}>
          <Feather name='check' size={24} color='black' />
        </View>
        <Text style={styles.completedText}>Completed</Text>
      </Animated.View>
    </View>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  completedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  checkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
