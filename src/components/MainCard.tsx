  import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Animated,
  } from 'react-native';
  import React, { useState, useMemo, useRef, useEffect } from 'react';
  import Icon from 'react-native-vector-icons/Feather';
  import LoadingDots from 'react-native-loading-dots';
  import { MainCardProps } from '../../types/CardProps';

  const MainCard = ({ onCardVerified }: MainCardProps) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showCardType, setShowCardType] = useState(false);

    // Animation refs
    const arrowPosition = useRef(new Animated.Value(0)).current;
    const arrowScale = useRef(new Animated.Value(1)).current;
    const arrowOpacity = useRef(new Animated.Value(1)).current;
    const dotsOpacity = useRef(new Animated.Value(0)).current;
    const dotsScale = useRef(new Animated.Value(0.5)).current;
    const dot1Opacity = useRef(new Animated.Value(0.3)).current;
    const dot2Opacity = useRef(new Animated.Value(0.3)).current;
    const dot3Opacity = useRef(new Animated.Value(0.3)).current;

    // Refs for auto-focus
    const cardNumberRef = useRef<TextInput>(null);
    const cvvRef = useRef<TextInput>(null);
    const cardHolderRef = useRef<TextInput>(null);
    const expiryRef = useRef<TextInput>(null);
    const zipcodeRef = useRef<TextInput>(null);

    // Validate and format card number with spaces (1111 1111 1111 1111)
    const formatCardNumber = (text: string) => {
      // Remove all non-digit characters
      const cleaned = text.replace(/\D/g, '');
      // Add spaces every 4 digits
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
      return formatted;
    };

    // Validate and format expiry date with automatic "/" insertion
    const formatExpiryDate = (text: string) => {
      // Remove all non-digit characters
      const cleaned = text.replace(/\D/g, '');
      
      if (cleaned.length <= 2) {
        return cleaned;
      } else {
        // Insert "/" after month
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
    };

    // Validate card holder name (only letters and spaces)
    const validateCardHolderName = (text: string) => {
      // Only allow letters, spaces, and common name characters
      const cleaned = text.replace(/[^a-zA-Z\s\-'\.]/g, '');
      return cleaned;
    };

    // Validate CVV (only digits)
    const validateCvv = (text: string) => {
      // Only allow digits
      const cleaned = text.replace(/\D/g, '');
      return cleaned;
    };

    // Validate zipcode (only digits)
    const validateZipcode = (text: string) => {
      // Only allow digits
      const cleaned = text.replace(/\D/g, '');
      return cleaned;
    };

    // Validate expiry date (called when form is submitted)
    const validateExpiryDate = (expiryText: string) => {
      if (expiryText.length !== 5) return false;
      
      const parts = expiryText.split('/');
      if (parts.length !== 2) return false;
      
      const month = parseInt(parts[0]);
      const year = parseInt(parts[1]);
      
      // Validate month (01-12)
      if (month < 1 || month > 12) return false;
      
      // Validate year (current year onwards)
      const currentYear = 25; // Since today is 07/25
      if (year < currentYear) return false;
      
      // Validate if it's current year, check if month is not in the past
      if (year === currentYear) {
        const currentMonth = 7; // July
        if (month < currentMonth) return false;
      }
      
      return true;
    };

    // Handle card number input
    const handleCardNumberChange = (text: string) => {
      const formatted = formatCardNumber(text);
      setCardNumber(formatted);
      
      // Auto-focus to CVV when card number is complete
      if (formatted.replace(/\s/g, '').length === 16) {
        cvvRef.current?.focus();
      }
    };

    // Handle expiry date input
    const handleExpiryChange = (text: string) => {
      const formatted = formatExpiryDate(text);
      setExpiry(formatted);
      
      // Auto-focus to zipcode when expiry is complete
      if (formatted.length === 5) {
        zipcodeRef.current?.focus();
      }
    };

    // Handle CVV input
    const handleCvvChange = (text: string) => {
      const validated = validateCvv(text);
      setCvv(validated);
      
      // Auto-focus to card holder name when CVV is complete
      if (validated.length === 3) {
        cardHolderRef.current?.focus();
      }
    };

    // Handle card holder name input
    const handleCardHolderChange = (text: string) => {
      const validated = validateCardHolderName(text);
      // Limit to 20 characters
      const limitedText = validated.slice(0, 20);
      setCardHolderName(limitedText);
      
      // Auto-focus to expiry when card holder name reaches 20 characters
      if (limitedText.length === 20) {
        expiryRef.current?.focus();
      }
    };

    // Handle zipcode input
    const handleZipcodeChange = (text: string) => {
      const validated = validateZipcode(text);
      setZipcode(validated);
    };

    const isAllFieldsFilled = useMemo(() => {
      const cleanedCardNumber = cardNumber.replace(/\s/g, '');
      return (
        cleanedCardNumber.length === 16 &&
        cvv.length === 3 &&
        cardHolderName.trim().length > 0 &&
        validateExpiryDate(expiry) &&
        zipcode.length >= 5
      );
    }, [cardNumber, cvv, cardHolderName, expiry, zipcode]);

    const handleArrowPress = () => {
      console.log('Arrow pressed, isAllFieldsFilled:', isAllFieldsFilled, 'isVerifying:', isVerifying);
      if (isAllFieldsFilled && !isVerifying) {
        setIsVerifying(true);
        
        // Start the animation sequence
        Animated.parallel([
          // Move arrow to left and scale down
          Animated.timing(arrowPosition, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(arrowScale, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Fade out arrow and show dots
          Animated.parallel([
            Animated.timing(arrowOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(dotsOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.spring(dotsScale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Start dots animation immediately
            startDotsAnimation();
          });
        });

        setTimeout(() => {
          setIsVerifying(false);
          // Reset animations
          resetAnimations();
          if (onCardVerified) {
            onCardVerified({
              id: Date.now().toString(),
              cardNumber: cardNumber.replace(/\s/g, ''),
              cardHolderName: cardHolderName.trim(),
              expiry: expiry,
              cvv: cvv,
              zipcode: zipcode,
            });
          }
        }, 3000);
      }
    };

    // Start dots animation sequence
    const startDotsAnimation = () => {
      console.log('Starting dots animation');
      // Set initial state - first dot active, others dim
      dot1Opacity.setValue(1);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);

      const createDotSequence = () => {
        return Animated.sequence([
          // First dot active
          Animated.parallel([
            Animated.timing(dot1Opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          // Second dot active
          Animated.parallel([
            Animated.timing(dot1Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          // Third dot active
          Animated.parallel([
            Animated.timing(dot1Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]);
      };

      const sequence = createDotSequence();
      sequence.start(() => {
        // Restart animation if still verifying
        if (isVerifying) {
          startDotsAnimation();
        }
      });
    };

    // Reset all animations
    const resetAnimations = () => {
      arrowPosition.setValue(0);
      arrowScale.setValue(1);
      arrowOpacity.setValue(1);
      dotsOpacity.setValue(0);
      dotsScale.setValue(0.5);
      dot1Opacity.setValue(0.3);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);
    };

    return (
      <View>
        <View style={styles.addCardContainer}>
          <Animated.View
            style={[
              styles.arrowBox,
              {
                backgroundColor: isAllFieldsFilled ? '#E14434' : '#666666',
                transform: [
                  {
                    translateX: arrowPosition.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -150], 
                    }),
                  },
                  { scale: arrowScale },
                ],
                opacity: arrowOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={handleArrowPress}
              disabled={!isAllFieldsFilled || isVerifying}
            >
              {/* Arrow Icon */}
              <Animated.View style={{ opacity: arrowOpacity }}>
                <Icon name="arrow-right" size={20} color="#FFF" />
              </Animated.View>
              
              {/* Dots Animation */}
                          <Animated.View
              style={[
                styles.dotsOverlay,
                {
                  opacity: dotsOpacity,
                  transform: [{ scale: dotsScale }],
                },
              ]}
            >
                <View style={styles.loadingIndicator}>
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        opacity: dot1Opacity,
                        backgroundColor: '#FFF',
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        opacity: dot2Opacity,
                        backgroundColor: '#FFF',
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        opacity: dot3Opacity,
                        backgroundColor: '#FFF',
                      },
                    ]}
                  />
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          {isVerifying ? (
            <View style={styles.loadingContainer}>
              <LoadingDots 
                colors={['#E14434', '#FFF', '#E14434']}
                dots={3}
                size={12}
                bounceHeight={8}
              />
              <Text style={styles.loadingText}>Verifying your card</Text>
            </View>
          ) : (
            <>
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <TextInput
                    ref={cardNumberRef}
                    style={styles.cardNumberInput}
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="numeric"
                    maxLength={19}
                    autoFocus={true}
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.smallInputGroup}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    ref={cvvRef}
                    style={styles.cvvInput}
                    value={cvv}
                    onChangeText={handleCvvChange}
                    placeholder="123"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={styles.fullWidthInputGroup}>
                <Text style={styles.inputLabel}>Card Holder Name</Text>
                <TextInput
                  ref={cardHolderRef}
                  style={styles.fullWidthInput}
                  value={cardHolderName}
                  onChangeText={handleCardHolderChange}
                  placeholder="John Doe"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  autoCapitalize="words"
                  maxLength={20}
                  returnKeyType="next"
                />
                <Text style={styles.characterCount}>
                  {cardHolderName.length}/20
                </Text>
              </View>

              <View style={styles.row}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.smallInputGroup}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <TextInput
                      ref={expiryRef}
                      style={[
                        styles.smallInput,
                        expiry.length === 5 && !validateExpiryDate(expiry) && styles.invalidInput
                      ]}
                      value={expiry}
                      onChangeText={handleExpiryChange}
                      placeholder="MM/YY"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="numeric"
                      maxLength={5}
                      returnKeyType="next"
                    />
                    {expiry.length === 5 && !validateExpiryDate(expiry) && (
                      <Text style={styles.errorText}>Invalid date</Text>
                    )}
                  </View>
                  <View style={[styles.smallInputGroup, { marginLeft: 20 }]}> 
                    <Text style={styles.inputLabel}>Zip Code</Text>
                    <TextInput
                      ref={zipcodeRef}
                      style={styles.smallInput}
                      value={zipcode}
                      onChangeText={handleZipcodeChange}
                      placeholder="12345"
                      keyboardType="numeric"
                      maxLength={6}
                      returnKeyType="done"
                    />
                  </View>
                </View>
                {showCardType ? (
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>VISA</Text>
                  </View>
                ) : null}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  export default MainCard;

  const styles = StyleSheet.create({
    addCardContainer: {
      width: 350,
      height: 230,
      backgroundColor: '#000000',
      marginTop: 30,
      elevation: 3,
      padding: 15,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#f7b092',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 12,
    },
    inputGroup: {
      flex: 1,
      marginHorizontal: 5,
    },
    inputLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFF',
      marginBottom: 6,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    cardNumberInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 0.4,
      borderBottomColor: 'rgba(255,255,255,0.6)',
      color: '#FFF',
      fontSize: 15,
      fontWeight: '500',
      paddingVertical: 6,
      paddingHorizontal: 0,
      letterSpacing: 0.3,
      width: '100%',
    },
    cvvInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 0.4,
      borderBottomColor: 'rgba(255,255,255,0.6)',
      color: '#FFF',
      fontSize: 15,
      fontWeight: '500',
      paddingVertical: 6,
      paddingHorizontal: 0,
      letterSpacing: 0.3,
      width: '100%',
    },
    cardBadge: {
      padding: 8,
      minWidth: 60,
    },
    cardBadgeText: {
      fontSize: 24,
      fontStyle: 'italic',
      fontWeight: '800',
      color: '#FFF',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    fullWidthInputGroup: {
      width: '100%',
      marginBottom: 12,
      paddingHorizontal: 5,
    },
    fullWidthInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 0.4,
      borderBottomColor: 'rgba(255,255,255,0.6)',
      color: '#FFF',
      fontSize: 15,
      fontWeight: '500',
      paddingVertical: 6,
      paddingHorizontal: 0,
      height: 35,
      letterSpacing: 0.3,
    },
    smallInputGroup: {
      width: 80,
      marginHorizontal: 5,
    },
    smallInput: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 0.4,
      borderBottomColor: 'rgba(255,255,255,0.6)',
      color: '#FFF',
      fontSize: 15,
      fontWeight: '500',
      paddingVertical: 4,
      paddingHorizontal: 0,
      letterSpacing: 0.3,
    },
    arrowBox: {
      position: 'absolute',
      right: -20,
      top: '50%',
      transform: [{ translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#666666',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
      loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
    loadingIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FFF',
      marginHorizontal: 3,
    },
    loadingText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
      marginTop: 12,
    },
    characterCount: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.6)',
      textAlign: 'right',
      marginTop: 4,
      fontStyle: 'italic',
    },
    invalidInput: {
      borderBottomColor: '#FF6B6B',
    },
    errorText: {
      fontSize: 9,
      color: '#FF6B6B',
      marginTop: 2,
      fontStyle: 'italic',
    },
    arrowButton: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotsOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    dotsContainer: {
      position: 'absolute',
      right: -20,
      top: '50%',
      transform: [{ translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E14434',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
