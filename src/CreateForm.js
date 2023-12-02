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
} from "@mui/material";

function CreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    sectors: "",
    terms: false,
  });

  const sectorOptions = [
    "Manufacturing",
    "Construction materials",
    "Electronics and Optics",
    "Food and Beverage",
    "Bakery & confectionery products",
    "Beverages",
  ];

  const handleChange = (v, key) => {
    setFormData({
      ...formData,
      [key]: v,
    });
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ width: "100%", height: "100%" }}
    >
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
              options={sectorOptions || []}
              onChange={(e, v) => handleChange(v, "sectors")}
              renderInput={(params) => (
                <TextField {...params} label="Sectors" required />
              )}
            />

            <FormControlLabel
              required
              label="Agree to terms"
              control={
                <Checkbox
                  checked={formData?.terms}
                  onChange={(e, v) => handleChange(v, "terms")}
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
                  formData?.sectors?.length > 0 &&
                  formData?.terms
                )
              }
              onClick={() => handleSubmit()}
              style={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CreateForm;
