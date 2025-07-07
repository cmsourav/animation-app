import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Pressable,
  Easing,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AddCard from '../components/AddCard';
import OrderDetails from '../components/OrderDetails';
import MainCard from '../components/MainCard';
import FullScreenBottomSheet from '../components/FullScreenBottomSheet';
import { useDotAnimation } from '../hooks/useDotAnimation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expiry: string;
  cvv: string;
  zipcode: string;
}

const CARD_WIDTH = 350;
const CARD_MARGIN = 20; // marginHorizontal: 10 on each side
const CARD_FULL_WIDTH = CARD_WIDTH + CARD_MARGIN;

const BottomSheetContent = ({ onComplete }: { onComplete: () => void }) => {
  const [completed, setCompleted] = useState(false);
  const { dot1Opacity, dot2Opacity, dot3Opacity } = useDotAnimation({
    animationDuration: 400,
    autoStart: true,
    onAnimationComplete: undefined,
    stopAfter: undefined,
  });

  // Animation for completed icon
  const completedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (completed) {
      Animated.timing(completedAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
      timer = setTimeout(onComplete, 1500);
    } else {
      timer = setTimeout(() => {
        setCompleted(true);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [completed, completedAnim, onComplete]);

  if (completed) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View
          style={{
            marginBottom: 24,
            transform: [
              {
                scale: completedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
            opacity: completedAnim,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 6,
            }}
          >
            <Text style={{ fontSize: 44, color: '#4BB543' }}>✓</Text>
          </View>
        </Animated.View>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>Payment Completed!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Payment Processing</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
        <Animated.View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            marginHorizontal: 8,
            backgroundColor: '#fff',
            opacity: dot1Opacity,
          }}
        />
        <Animated.View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            marginHorizontal: 8,
            backgroundColor: '#fff',
            opacity: dot2Opacity,
          }}
        />
        <Animated.View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            marginHorizontal: 8,
            backgroundColor: '#fff',
            opacity: dot3Opacity,
          }}
        />
      </View>
    </View>
  );
};

const MessageScreen = () => {
  const [showMainCard, setShowMainCard] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);
  const [lastAddedCardId, setLastAddedCardId] = useState<string | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Animation refs for new card
  const newCardAnim = useRef(new Animated.Value(0)).current;
  const newCardScale = useRef(new Animated.Value(0.8)).current;

  const handleAddCardPress = () => {
    setShowMainCard(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCardVerified = (cardData: SavedCard) => {
    setSavedCards(prev => [cardData, ...prev]);
    setLastAddedCardId(cardData.id);
    setShowMainCard(false);
    setCurrentCardIndex(0);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
  };

  // Button color logic
  const isAddCardCurrentlyVisible = currentCardIndex === savedCards.length;
  const payNowButtonColor = isAddCardCurrentlyVisible ? '#87A2FF' : '#E14434';

  const handlePayNowPress = () => {
    // Only open the bottom sheet if a real card is selected
    if (currentCardIndex !== savedCards.length) {
      setBottomSheetVisible(true);
    }
  };

  // Update currentCardIndex based on scroll position
  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / CARD_FULL_WIDTH);
    setCurrentCardIndex(index);
  };

  useEffect(() => {
    if (lastAddedCardId) {
      newCardAnim.setValue(0);
      newCardScale.setValue(0.8);
      Animated.parallel([
        Animated.timing(newCardAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(newCardScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => setLastAddedCardId(null), 500);
      });
    }
  }, [lastAddedCardId]);

  const renderSavedCard = (card: SavedCard) => {
    if (card.id === lastAddedCardId) {
      return (
        <Animated.View
          style={{
            opacity: newCardAnim,
            transform: [{ scale: newCardScale }],
          }}
        >
          <View style={styles.savedCardContainer}>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <Text style={styles.cardNumberDisplay}>
                  {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                </Text>
              </View>
              <View style={styles.smallInputGroup}>
                <Text style={styles.inputLabel}>CVV</Text>
                <Text style={styles.cvvDisplay}>***</Text>
              </View>
            </View>
            <View style={styles.fullWidthInputGroup}>
              <Text style={styles.inputLabel}>Card Holder Name</Text>
              <Text style={styles.cardHolderDisplay}>
                {card.cardHolderName}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.smallInputGroup}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <Text style={styles.expiryDisplay}>{card.expiry}</Text>
              </View>
              <View style={styles.smallInputGroup}>
                <Text style={styles.inputLabel}>Zip Code</Text>
                <Text style={styles.zipcodeDisplay}>{card.zipcode}</Text>
              </View>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>VISA</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      );
    }
    // Default rendering for other cards
    return (
      <View style={styles.savedCardContainer}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <Text style={styles.cardNumberDisplay}>
              {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
            </Text>
          </View>
          <View style={styles.smallInputGroup}>
            <Text style={styles.inputLabel}>CVV</Text>
            <Text style={styles.cvvDisplay}>***</Text>
          </View>
        </View>
        <View style={styles.fullWidthInputGroup}>
          <Text style={styles.inputLabel}>Card Holder Name</Text>
          <Text style={styles.cardHolderDisplay}>{card.cardHolderName}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.smallInputGroup}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <Text style={styles.expiryDisplay}>{card.expiry}</Text>
          </View>
          <View style={styles.smallInputGroup}>
            <Text style={styles.inputLabel}>Zip Code</Text>
            <Text style={styles.zipcodeDisplay}>{card.zipcode}</Text>
          </View>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>VISA</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showMainCard ? (
        <Animated.View
          style={[
            styles.mainCardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <MainCard onCardVerified={handleCardVerified} />
        </Animated.View>
      ) : (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {savedCards.map((card, index) => (
              <View key={card.id} style={styles.cardWrapper}>
                {renderSavedCard(card)}
              </View>
            ))}
            <View style={styles.cardWrapper}>
              <AddCard onPress={handleAddCardPress} />
            </View>
          </ScrollView>
        </View>
      )}
      <View style={{ alignItems: 'center', marginTop: 35 }}>
        <OrderDetails />
        <View style={{ height: 35 }} />
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: payNowButtonColor },
          ]}
          onPress={handlePayNowPress}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFF' }}>
            Pay Now
          </Text>
        </TouchableOpacity>
      </View>
      <FullScreenBottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
      >
        <BottomSheetContent onComplete={() => setBottomSheetVisible(false)} />
      </FullScreenBottomSheet>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 250,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  savedCardContainer: {
    width: 350,
    height: 215,
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
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  smallInputGroup: {
    width: 80,
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
  cardNumberDisplay: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 0,
    letterSpacing: 0.3,
    width: '100%',
  },
  cvvDisplay: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 0,
    letterSpacing: 0.3,
    width: '100%',
  },
  fullWidthInputGroup: {
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  cardHolderDisplay: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 0,
    height: 35,
    letterSpacing: 0.3,
  },
  expiryDisplay: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 0,
    letterSpacing: 0.3,
  },
  zipcodeDisplay: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 0,
    letterSpacing: 0.3,
  },
  cardBadge: {
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  scrollContainer: {
    padding: 10,
  },
  cardWrapper: {
    width: 350,
    marginHorizontal: 10,
  },
  mainCardContainer: {
    alignItems: 'center',
  },
});
