import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AddCard from '../components/AddCard';
import OrderDetails from '../components/OrderDetails';
import MainCard from '../components/MainCard';
import CustomBottomSheet from '../components/CustomBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expiry: string;
  cvv: string;
  zipcode: string;
}

const MessageScreen = () => {
  const [showMainCard, setShowMainCard] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);
  const [lastAddedCardId, setLastAddedCardId] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sheetAnim = useRef(new Animated.Value(0)).current;

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

  const handlePayNowPress = () => {
    if (savedCards.length === 0) {
      console.log('No saved cards available for payment');
      return;
    }
    setShowPaymentSheet(true);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePaymentCompleted = () => {
    // Handle payment completion
    console.log('Payment completed successfully!');

    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowPaymentSheet(false);
    });
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollX = contentOffset.x;
    const screenWidth = layoutMeasurement.width;
    const totalWidth = contentSize.width;

    const addCardPosition = totalWidth - screenWidth;
    setIsAddCardVisible(scrollX >= addCardPosition - 50);
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
            {
              backgroundColor:
                savedCards.length === 0
                  ? '#87A2FF'
                  : '#E6521F',
            },
          ]}
          onPress={handlePayNowPress}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFF' }}>
            Pay Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Processing Sheet */}
      {showPaymentSheet && (
        <Animated.View
          style={[
            styles.paymentSheetContainer,
            {
              opacity: sheetAnim,
            },
          ]}
        >
          <CustomBottomSheet
            message="Processing payment..."
            backgroundColor="#E6521F"
            dotColor="#E8F5E8"
            activeDotColor="#4CAF50"
            stopAfter={6000}
            onCompleted={handlePaymentCompleted}
          />
        </Animated.View>
      )}
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
  paymentSheetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
