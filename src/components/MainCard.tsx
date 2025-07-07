import React, { useState, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { MainCardProps } from '../../types/CardProps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';

const MainCard = ({ onCardVerified }: MainCardProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [showCardType, setShowCardType] = useState(false);
  const [showVerificationContent, setShowVerificationContent] = useState(false);

  const cardNumberRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const cardHolderRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const zipcodeRef = useRef<TextInput>(null);

  const arrowOpacity = useSharedValue(1);
  const dotTranslateX = useSharedValue(0);

  const whiteDot1Opacity = useSharedValue(0);
  const whiteDot2Opacity = useSharedValue(0);

  const dot2ColorProgress = useSharedValue(0);
  const dot3ColorProgress = useSharedValue(0);

  const CARD_WIDTH = 340;
  const DOT_WIDTH = 12;
  const GAP = 10;
  const DOT_GROUP_WIDTH = DOT_WIDTH * 3 + GAP * 2;
  const START_RIGHT_OFFSET = -24;

  const DOT_MOVE_DISTANCE = -((CARD_WIDTH / 2) - DOT_GROUP_WIDTH / 2 + Math.abs(START_RIGHT_OFFSET));

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
  };

  const validateCardHolderName = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z\s\-'.]/g, '');
    return cleaned;
  };

  const validateCvv = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned;
  };

  const validateZipcode = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned;
  };

  const validateExpiryDate = (expiryText: string) => {
    if (expiryText.length !== 5) return false;
    const parts = expiryText.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0]);
    const year = parseInt(parts[1]);
    if (month < 1 || month > 12) return false;
    const currentYear = 25;
    if (year < currentYear) return false;
    if (year === currentYear) {
      const currentMonth = 7;
      if (month < currentMonth) return false;
    }
    return true;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
    if (formatted.replace(/\s/g, '').length === 16) {
      setShowCardType(true);
      cvvRef.current?.focus();
    } else {
      setShowCardType(false);
    }
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiry(formatted);
    if (formatted.length === 5) {
      zipcodeRef.current?.focus();
    }
  };

  const handleCvvChange = (text: string) => {
    const validated = validateCvv(text);
    setCvv(validated);
    if (validated.length === 3) {
      cardHolderRef.current?.focus();
    }
  };

  const handleCardHolderChange = (text: string) => {
    const validated = validateCardHolderName(text);
    const limitedText = validated.slice(0, 20);
    setCardHolderName(limitedText);
    if (limitedText.length === 20) {
      expiryRef.current?.focus();
    }
  };

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

  const arrowStyle = useAnimatedStyle(() => ({
    opacity: arrowOpacity.value,
  }));

  const dotGroupStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dotTranslateX.value }],
  }));

  const whiteDot1Style = useAnimatedStyle(() => ({
    opacity: whiteDot1Opacity.value,
  }));

  const whiteDot2Style = useAnimatedStyle(() => ({
    opacity: whiteDot2Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      dot2ColorProgress.value,
      [0, 1],
      ['white', 'red']
    );
    return { backgroundColor };
  });

  const dot3Style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      dot3ColorProgress.value,
      [0, 1],
      ['white', 'red']
    );
    return { backgroundColor };
  });

  const handleArrowPress = () => {
    if (isAllFieldsFilled) {
      arrowOpacity.value = withTiming(0, { duration: 200 });
      setShowVerificationContent(true);
      dotTranslateX.value = withTiming(
        DOT_MOVE_DISTANCE,
        {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        },
        (finished) => {
          if (finished) {
            whiteDot1Opacity.value = withDelay(
              100,
              withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
            );
            whiteDot2Opacity.value = withDelay(
              200,
              withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
            );
  
            dot2ColorProgress.value = withDelay(
              600,
              withTiming(1, { duration: 400 })
            );
            dot3ColorProgress.value = withDelay(
              1000,
              withTiming(1, { duration: 400 })
            );
  
            runOnJS(setShowVerificationContent)(true);
          }
        }
      );
      setTimeout(() => {
        setShowVerificationContent(false);
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

  return (
    <View>
      <View style={styles.addCardContainer}>
      <Animated.View style={[styles.arrowButton, arrowStyle]}>
          <Pressable onPress={handleArrowPress}>
            <Icon name="arrow-right" size={20} color="#FFF" />
          </Pressable>
        </Animated.View>

        {showVerificationContent ? (
          <View style={styles.loadingContainer}> 
            <Animated.View style={[styles.dotRow, dotGroupStyle]}>
            <View style={[styles.dot, { backgroundColor: 'red' }]} />
            <Animated.View style={[styles.dot, whiteDot1Style, dot2Style]} />
            <Animated.View style={[styles.dot, whiteDot2Style, dot3Style]} />
          </Animated.View>
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
                onSubmitEditing={() => expiryRef.current?.focus()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 12,
    marginLeft: -25
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -20,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: '#E14434',
    borderRadius: 20,
    elevation: 3,
  },
  dotRow: {
    position: 'absolute',
    right: -24,
    top: '45%',
    transform: [{ translateY: -6 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyingContainer: {
    position: 'absolute',
    top: '58%',
  },
  verifyingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});
