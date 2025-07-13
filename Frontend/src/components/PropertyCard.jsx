import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const BASE_URL = "http://localhost:3000"; // Use your deployed URL on production

const PropertyCard = ({ property, showActions = false, onDelete, onEdit }) => {
  const [openZoom, setOpenZoom] = useState(false);

  const imageSrc = property.imageUrl
    ? property.imageUrl.startsWith("http")
      ? property.imageUrl
      : `${BASE_URL}${property.imageUrl}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <>
      <Card sx={{ width: "100%", maxWidth: 345, mx: "auto" }}>
        <Box onClick={() => setOpenZoom(true)} sx={{ cursor: "zoom-in" }}>
          <CardMedia
            component="img"
            height="150"
            image={imageSrc}
            alt={property.title}
            sx={{ objectFit: "cover" }}
          />
        </Box>

        <CardContent>
          <Typography variant="h6" gutterBottom>
            {property.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.location}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {property.description}
          </Typography>
          <Typography variant="body1" color="primary" sx={{ mt: 1 }}>
            ₹ {property.price}
          </Typography>
        </CardContent>

        {showActions && (
          <CardActions>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(property._id)}
            >
              Delete
            </Button>
            <Button size="small" onClick={() => onEdit(property)}>
              Edit
            </Button>
          </CardActions>
        )}
      </Card>

      {/* Dialog for Zoomed Image */}
      <Dialog open={openZoom} onClose={() => setOpenZoom(false)} maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setOpenZoom(false)}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={imageSrc}
            alt="Zoomed"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "4px",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
