import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const PropertyCard = ({ property, showActions = false, onDelete, onEdit }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 345, mx: "auto" }}>
      <CardMedia
        component="img"
        height="200"
        image={
          property.imageUrl ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={property.title}
        sx={{
          objectFit: "cover",
        }}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {property.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {property.location}
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
  );
};

export default PropertyCard;
