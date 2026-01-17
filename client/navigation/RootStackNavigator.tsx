import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import SplashWelcomeScreen from "@/screens/SplashWelcomeScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import ImportantNotesScreen from "@/screens/ImportantNotesScreen";
import SubscriptionScreen from "@/screens/SubscriptionScreen";
import CategoryDetailScreen from "@/screens/CategoryDetailScreen";
import AddCategoryScreen from "@/screens/AddCategoryScreen";
import AddEditItemScreen from "@/screens/AddEditItemScreen";
import AdminPanelScreen from "@/screens/AdminPanelScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { RateItem } from "@/types/rate";

export type RootStackParamList = {
  SplashWelcome: undefined;
  Welcome: undefined;
  ImportantNotes: undefined;
  Subscription: undefined;
  Main: undefined;
  CategoryDetail: {
    categoryId: string;
    categoryName: string;
  };
  AddCategory: undefined;
  AddEditItem: {
    mode: "add" | "edit";
    categoryId: string;
    categoryName: string;
    item?: RateItem;
  };
  AdminPanel: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SplashWelcome"
        component={SplashWelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImportantNotes"
        component={ImportantNotesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        options={{
          headerTitle: "Category",
        }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{
          presentation: "modal",
          headerTitle: "Nai Category",
        }}
      />
      <Stack.Screen
        name="AddEditItem"
        component={AddEditItemScreen}
        options={{
          presentation: "modal",
          headerTitle: "Item",
        }}
      />
      <Stack.Screen
        name="AdminPanel"
        component={AdminPanelScreen}
        options={{
          headerTitle: "Admin Panel",
        }}
      />
    </Stack.Navigator>
  );
}
