import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function AppBar(props) {
  const { selectedScreen, setSelectedScreen } = props;

  useEffect(() => {
    const location = window?.location?.pathname;
    if (location === "/") {
      return setSelectedScreen("create");
    } else {
      return setSelectedScreen("list");
    }
  });

  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "calc(100% - 60px)",
          alignItems: "center",
        }}
      >
        <Box sx={{ ml: 1 }}>
          <Typography variant="h5" fontWeight={"bold"}>
            Form Management Application
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={
              selectedScreen === "list"
                ? { p: 1, backgroundColor: "lightblue" }
                : { p: 1 }
            }
          >
            <Link
              to="/list"
              onClick={() => setSelectedScreen("list")}
              style={{ textDecoration: "none" }}
            >
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Form List
              </Typography>
            </Link>
          </Box>
          <Box
            sx={
              selectedScreen === "create"
                ? { p: 1, backgroundColor: "lightblue" }
                : { p: 1 }
            }
          >
            <Link
              to="/"
              onClick={() => setSelectedScreen("create")}
              style={{ textDecoration: "none" }}
            >
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Create Form
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default AppBar;
