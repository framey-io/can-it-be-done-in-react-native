import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  State,
  TapGestureHandler
} from "react-native-gesture-handler";
import Animated, {
  Value,
  abs,
  add,
  block,
  cond,
  debug,
  eq,
  greaterThan,
  max,
  set,
  sub,
  useCode
} from "react-native-reanimated";
import {
  canvas2Polar,
  onGestureEvent,
  polar2Canvas,
  toDeg,
  useDiff,
  useValues
} from "react-native-redash";

import Buttons from "./Buttons";
import { Command } from "./IPodNavigator";

const { PI } = Math;
const { width } = Dimensions.get("window");
const size = 0.75 * (width - 32);
const hole = size * 0.39;
const center = {
  x: size / 2,
  y: size / 2
};
const delta = (a0: Animated.Node<number>, a: Animated.Node<number>) => {
  const da = sub(a0, a);
  return cond(
    greaterThan(abs(da), PI),
    cond(greaterThan(a0, 0), sub(2 * PI, da), sub(-2 * PI, da)),
    da
  );
};
const styles = StyleSheet.create({
  container: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "#323232",
    justifyContent: "center",
    alignItems: "center"
  },
  center: {
    width: hole,
    height: hole,
    borderRadius: hole / 2,
    backgroundColor: "black"
  }
});

interface ClickWheelProps {
  alpha: Animated.Value<number>;
  command: Animated.Value<Command>;
}

export default ({ alpha, command }: ClickWheelProps) => {
  const [state, x, y] = useValues([State.UNDETERMINED, 0, 0, 0, 0], []);
  const deltaX = useDiff(x, []);
  const deltaY = useDiff(y, []);
  const gestureHandler = onGestureEvent({ state, x, y });
  const x0 = cond(eq(state, State.ACTIVE), sub(x, deltaX), x);
  const y0 = cond(eq(state, State.ACTIVE), sub(y, deltaY), y);
  const a0 = canvas2Polar({ x: x0, y: y0 }, center).alpha;
  const a = canvas2Polar({ x, y }, center).alpha;
  const da = delta(a0, a);
  useCode(() => block([set(alpha, max(add(alpha, da), 0))]), [alpha, da]);
  return (
    <View style={styles.container}>
      <Buttons {...{ command }}>
        <PanGestureHandler {...gestureHandler}>
          <Animated.View style={StyleSheet.absoluteFill} />
        </PanGestureHandler>
      </Buttons>
      <View style={styles.center} />
    </View>
  );
};