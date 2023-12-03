import { Box } from "@mui/material";
import AppBar from "./AppBar";
import { Route, Routes } from "react-router-dom";
import FormScreen from "./FormScreen";
import CreateForm from "./CreateForm";
import { useState } from "react";

function App() {
  const [selectedScreen, setSelectedScreen] = useState("");

  return (
    <Box>
      <AppBar
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
      />
      <Routes>
        <Route path="/" element={<CreateForm />} />
        <Route path="/list" element={<FormScreen />} />
      </Routes>
    </Box>
  );
}

export default App;
