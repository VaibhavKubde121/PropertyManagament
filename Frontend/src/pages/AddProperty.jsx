import { useState } from "react";
import { Box, TextField, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import CustomizedSnackbars from "../components/Snackbar";

const AddProperty = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: null, // for file
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("price", form.price);
    formData.append("image", form.image);

    try {
      await API.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbar({
        open: true,
        message: "Property added successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add property",
        severity: "error",
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Property
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Price (₹)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </Button>
        {form.image && (
          <Typography variant="body2" mt={1}>
            Selected: {form.image.name}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Add Property
        </Button>
      </Box>
      <CustomizedSnackbars
        openSnackbar={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Paper>
  );
};

export default AddProperty;
