import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  lighten,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  getAllForms,
  getAllParentChildren,
  getAllParentOptions,
  getCounts,
  updateForm,
} from "./Service";
import axios from "axios";
import styled from "@emotion/styled";
import CustomPieChart from "./CustomPieChart";

function FormScreen() {
  const [formDataList, setFormDataList] = useState([]);
  const [selectedFormData, setSelectedFormData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [parentSectors, setParentSectors] = useState([]);
  const [childSectors, setChildSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cancelToken, setCancelToken] = useState(null);
  const [enableOptions, setEnableOptions] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [key, setKey] = useState(1);
  const [chartData, setChartData] = React.useState([]);
  const [displayData, setDisplayData] = React.useState([
    { id: 0, value: 0, label: "" },
  ]);

  useEffect(() => {
    getCounts().then((res) => {
      if (res?.data) {
        setChartData(res?.data);
      }
    });
  }, []);

  useEffect(() => {
    let tempData = [];
    chartData?.forEach((row, idx) => {
      tempData?.push({ id: idx, value: row?.total, label: row?.name });
    });
    setDisplayData(tempData);
  }, [chartData]);

  useEffect(() => {
    if (cancelToken) {
      cancelToken.cancel("Operation canceled by the user.");
    }
    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);
    getData(newCancelToken.token);
    getOptionData(newCancelToken.token);

    handleMakeSectorOptions();
    return () => {
      if (newCancelToken) {
        newCancelToken.cancel("Component unmounted.");
        // setMessage("Stopping API calls after Component unmounted.");
        setShowNotification(false);
      }
    };
  }, []);

  const handleEditClick = (formData) => {
    handleMakeSectorOptions();
    setSelectedFormData(formData);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedFormData(null);
    setEditDialogOpen(false);
  };

  const getData = (token) => {
    getAllForms({ cancelToken: token })
      .then((res) => {
        if (res?.data?.length > 0) {
          setFormDataList(res?.data);
          setEnableOptions(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.log("An error occurred:", error.message);
        }
      });
  };

  const getOptionData = (token) => {
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

  const handleSaveEdit = () => {
    const updatedFormDataList = formDataList.map((formData) =>
      formData.id === selectedFormData.id ? selectedFormData : formData
    );
    setFormDataList(updatedFormDataList);
    updateForm(selectedFormData)
      .then((res) => {
        if (res?.status === 200) {
          setMessage("Form Successfully Updated!");
          setKey(1);
          setShowNotification(true);
        } else {
          setMessage("Form Updation Failed!");
          setKey(0);
          setShowNotification(true);
        }
      })
      .finally(() => {
        getData();
      });
    handleEditDialogClose();
  };

  const handleSaveNewObj = (key, v) => {
    setSelectedFormData({
      ...selectedFormData,
      [key]: v,
    });
  };

  const GroupHeader = styled("div")(({ theme }) => ({
    position: "sticky",
    top: "-8px",
    padding: "4px 10px",
    color: "black",
    backgroundColor: lighten("rgb(0, 0, 255)", 0.85),
  }));

  const GroupItems = styled("ul")({
    padding: 0,
  });

  const showData = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);

      // Get the year, month, day, hours, minutes, and seconds
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const milliseconds = date.getMilliseconds();

      // Create a readable date format
      const readableDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

      return readableDate;
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        List of Forms
      </Typography>
      <Paper
        elevation={3}
        sx={{
          "@global": {
            "*::-webkit-scrollbar": {
              width: "0.4em",
            },
            "*::-webkit-scrollbar-track": {
              "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "*::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid slategrey",
            },
          },
        }}
      >
        {formDataList?.length > 0 ? (
          <List
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {formDataList.map((formData) => (
              <>
                <ListItem key={formData.id}>
                  <ListItemText
                    primary={formData.name}
                    secondary={showData(formData?.createdAt)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Edit"
                      onClick={() => handleEditClick(formData)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="middle" flexItem />
              </>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 1,
            }}
          >
            <Typography variant="subtitle">
              Please Create new form before trying to edit or view
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            ml: 2,
          }}
        >
          <Typography variant="caption" fontWeight={"bold"}>
            Sectors count from FormData
          </Typography>
        </Box>
        <Box
          sx={{
            mt: "15px",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {displayData?.length > 1 && <CustomPieChart data={displayData} />}
        </Box>
      </Paper>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Form Data</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={selectedFormData ? selectedFormData.name : ""}
            onChange={(e) => handleSaveNewObj("name", e?.target?.value)}
            margin="normal"
            variant="outlined"
            required
          />
          <Autocomplete
            freeSolo
            options={sectors || []}
            value={
              sectors?.find((v) => v?.id === selectedFormData?.sectors) || {
                id: 0,
                name: "",
              }
            }
            onChange={(e, v) => handleSaveNewObj("sectors", v?.id)}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
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
                checked={
                  selectedFormData ? selectedFormData.agreedToTerms : false
                }
                onChange={(e, v) => handleSaveNewObj("agreedToTerms", v)}
              />
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            disabled={
              !(
                selectedFormData?.name?.length > 0 &&
                selectedFormData?.sectors > 0 &&
                selectedFormData?.agreedToTerms
              )
            }
            style={{ marginTop: "20px" }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
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
    </Box>
  );
}

export default FormScreen;
