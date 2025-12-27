import { SafeAreaProvider } from "react-native-safe-area-context";

import DoIt from './components/DoIt';

export default function App() {
  return (
    <SafeAreaProvider>
      <DoIt></DoIt>
    </SafeAreaProvider>
  );
}

