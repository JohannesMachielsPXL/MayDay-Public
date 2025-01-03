import * as React from "react";
import Navbar from "./Navbar";
import { CloseableToast } from "./CloseableToast";
import { useContext, useEffect } from "react";
import { AppContext } from "./AppProvider";

const App: React.FC = () => {
  const { dataStore } = useContext(AppContext);

  useEffect(() => {
    const initializeDataStore = async () => {
      await dataStore.initialize();
    };

    void initializeDataStore();
  });

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <CloseableToast />
    </>
  );
};

export default App;
