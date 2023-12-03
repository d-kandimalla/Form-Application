import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import {
  createForm,
  getAllParentChildren,
  getAllParentOptions,
} from "./Service";

function CreateForm() {
  var key = 1;
  const [formData, setFormData] = useState({
    name: "",
    sectors: 0,
    agreedToTerms: false,
  });

  const [parentSectors, setParentSectors] = useState([]);
  const [childSectors, setChildSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cancelToken, setCancelToken] = useState(null);
  const [enableOptions, setEnableOptions] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [message, setMessage] = useState("");
  const [enableCreateForm, setEnableCreateForm] = useState(false);

  useEffect(() => {
    if (cancelToken) {
      cancelToken.cancel("Operation canceled by the user.");
    }
    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);

    if (childSectors?.length < 1 && parentSectors?.length < 1) {
      getData(newCancelToken.token);
    }

    return () => {
      if (newCancelToken) {
        newCancelToken.cancel("Component unmounted.");
        // setMessage("Stopping API calls after Component unmounted.");
        setShowNotification(false);
      }
    };
  }, []);

  const handleChange = (v, key) => {
    setFormData({
      ...formData,
      [key]: v,
    });
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
    createForm(formData).then((res) => {
      if (res?.status === 201) {
        setMessage("Form Created Successfully!");
        key = 1;
        setShowNotification(true);
      } else {
        setMessage("Form Creation Failed!");
        key = 0;
        setShowNotification(true);
      }
    });
    resetData();
  };

  const resetData = () => {
    setFormData({
      name: "",
      sectors: 0,
      agreedToTerms: false,
    });
  };

  const getData = (token) => {
    if (!(parentSectors?.length > 0)) {
      getAllParentOptions({ cancelToken: token })
        .then((res) => {
          let tempData = [];
          setParentSectors(res?.data);
          res?.data?.forEach((row, idx) => {
            getAllParentChildren(row.id).then((res) => {
              tempData.push(...res?.data);
              setChildSectors(tempData);
            });
            if (idx === res?.data?.length - 1) {
              setEnableOptions(true);
            }
          });
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            console.log("An error occurred:", error.message);
          }
        });
    }
  };

  const handleMakeSectorOptions = () => {
    let data = [];
    if (enableOptions) {
      childSectors.map((item) => {
        const parent = parentSectors?.find((v) => v?.id === item?.parentId);
        return data.push({
          id: item?.id,
          parentId: item?.parentId,
          name: item?.name,
          parentName: parent?.name,
        });
      });
      setSectors(data);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ width: "100%", height: "100%" }}
    >
      {enableCreateForm ? (
        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ height: "100%" }}>
          <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Please enter your name and pick the Sectors you are currently
              involved in.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="Name"
                value={formData.name}
                onChange={(e) => handleChange(e?.target?.value, "name")}
                margin="normal"
                variant="outlined"
                required
              />
              <Autocomplete
                freeSolo
                options={sectors || []}
                value={
                  sectors.find((v) => v?.id === formData?.sectors) || {
                    id: 0,
                    name: "",
                  }
                }
                onChange={(e, v) => handleChange(v.id, "sectors")}
                groupBy={(option) => option?.parentName || ""}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(o, v) => o?.id === v?.id}
                disableClearable
                renderInput={(params) => (
                  <TextField {...params} label="Sectors" required />
                )}
              />

              <FormControlLabel
                required
                label="Agree to terms"
                control={
                  <Checkbox
                    checked={formData?.agreedToTerms}
                    onChange={(e, v) => handleChange(v, "agreedToTerms")}
                  />
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  !(
                    formData?.name?.length > 0 &&
                    formData?.sectors > 0 &&
                    formData?.agreedToTerms
                  )
                }
                style={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={() => {
              handleMakeSectorOptions();
              setEnableCreateForm(true);
            }}
          >
            Create new form
          </Button>
        </Box>
      )}

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={() => setShowNotification(false)}
      >
        <Alert
          severity={key === 1 ? "success" : "error"}
          sx={
            key === 1
              ? { backgroundColor: "lightgreen" }
              : { backgroundColor: "lightred" }
          }
          onClose={() => setShowNotification(false)}
        >
          <Typography fontWeight={"bold"}>{message}</Typography>
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default CreateForm;
