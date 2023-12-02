import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function FormScreen() {
  const [formDataList, setFormDataList] = useState([
    { id: 1, name: "Test1", sectors: "Data for Form 1", terms: true },
    { id: 2, name: "Test2", sectors: "Data for Form 2", terms: true },
    // Add more form data items as needed
  ]);

  const sectorOptions = [
    "Manufacturing",
    "Construction materials",
    "Electronics and Optics",
    "Food and Beverage",
    "Bakery & confectionery products",
    "Beverages",
  ];

  const [selectedFormData, setSelectedFormData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditClick = (formData) => {
    setSelectedFormData(formData);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedFormData(null);
    setEditDialogOpen(false);
  };

  const handleSaveEdit = () => {
    // Implement logic to save edited form data here
    const updatedFormDataList = formDataList.map((formData) =>
      formData.id === selectedFormData.id ? selectedFormData : formData
    );
    setFormDataList(updatedFormDataList);
    handleEditDialogClose();
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        List of Forms
      </Typography>
      <Paper elevation={3}>
        <List>
          {formDataList.map((formData) => (
            <ListItem key={formData.id}>
              <ListItemText
                primary={formData.name}
                secondary={formData.sectors}
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
          ))}
        </List>
      </Paper>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Form Data</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={selectedFormData ? selectedFormData.name : ""}
            onChange={(e) =>
              setSelectedFormData({
                ...selectedFormData,
                name: e.target.value,
              })
            }
            margin="normal"
            variant="outlined"
            required
          />
          <Autocomplete
            value={selectedFormData ? selectedFormData.sectors : ""}
            options={sectorOptions || []}
            onChange={(e, v) =>
              setSelectedFormData({
                ...selectedFormData,
                sectors: v,
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Sectors" required />
            )}
          />

          <FormControlLabel
            required
            label="Agree to terms"
            control={
              <Checkbox
                checked={selectedFormData ? selectedFormData.terms : false}
                onChange={(e, v) =>
                  setSelectedFormData({
                    ...selectedFormData,
                    terms: v,
                  })
                }
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
                selectedFormData?.sectors?.length > 0 &&
                selectedFormData?.terms
              )
            }
            style={{ marginTop: "20px" }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default FormScreen;
