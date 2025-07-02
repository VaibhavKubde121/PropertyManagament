import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import CustomizedSnackbars from "../components/Snackbar";

const Login = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors = {};
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Invalid email format";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setSnackbar({
        open: true,
        message: "Please fix the validation errors",
        severity: "error",
      });
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim(),
      });

      localStorage.setItem("token", res.data.token);
      setSnackbar({
        open: true,
        message: "Logged in successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.msg || "Login failed",
        severity: "error",
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
      <CustomizedSnackbars
        openSnackbar={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false });
        }}
      />
    </Paper>
  );
};

export default Login;
