import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  diffClamp,
  usePanGestureHandler,
  withDecay,
  withOffset,
} from "react-native-redash";
import Card, { CARD_HEIGHT, Cards } from "../Transformations/components/Card";

const MARGIN = 16;
const HEIGHT = CARD_HEIGHT + MARGIN * 2;
const cards = [
  {
    type: Cards.Card1,
  },
  {
    type: Cards.Card2,
  },
  {
    type: Cards.Card3,
  },
  {
    type: Cards.Card1,
  },
  {
    type: Cards.Card2,
  },
  {
    type: Cards.Card3,
  },
];
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  card: {
    marginVertical: MARGIN,
  },
});

const Wallet = () => {
  const [containerHeight, setContainerHeight] = useState(0);
  const visibleCards = Math.floor(containerHeight / HEIGHT);
  const {
    gestureHandler,
    translation,
    state,
    velocity,
  } = usePanGestureHandler();
  const y = diffClamp(
    withDecay({
      value: translation.y,
      velocity: velocity.y,
      state,
    }),
    -HEIGHT * cards.length + visibleCards * HEIGHT,
    0
  );
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={styles.container}
        onLayout={({
          nativeEvent: {
            layout: { height },
          },
        }) => setContainerHeight(height)}
      >
        {cards.map(({ type }, index) => {
          const translateY = interpolate(y, {
            inputRange: [-HEIGHT * index, 0],
            outputRange: [-HEIGHT * index, 0],
            extrapolate: Extrapolate.CLAMP,
          });
          const scale = interpolate(y, {
            inputRange: [-HEIGHT * (index + 1), -HEIGHT * index],
            outputRange: [0.8, 1],
            extrapolate: Extrapolate.CLAMP,
          });
          const opacity = interpolate(y, {
            inputRange: [-HEIGHT * (index + 1), -HEIGHT * (index + 0.5)],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP,
          });
          return (
            <Animated.View
              style={[
                styles.card,
                { opacity, transform: [{ translateY }, { scale }] },
              ]}
              key={index}
            >
              <Card {...{ type }} />
            </Animated.View>
          );
        })}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Wallet;