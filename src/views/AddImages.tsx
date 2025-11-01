import React, { useState, useRef } from "react";
import {
  Container,
  CssBaseline,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Resizer from "react-image-file-resizer";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddImages: React.FC = () => {
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resizedImage, setResizedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);

      Resizer.imageFileResizer(
        file,
        800, // Max width
        600, // Max height
        "JPEG", // Output format
        70, // Quality (0-100)
        0, // Rotation
        (resizedFile) => {
          setResizedImage(resizedFile as File);
        },
        "file"
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Proszę wybrać zdjęcie.");
      setSuccess("");
      return;
    }

    try {
      const formData = new FormData();
      // Używamy przeskalowane zdjęcie, jeśli istnieje, w przeciwnym razie oryginał
      formData.append("image", resizedImage || selectedImage);
      formData.append("description", description);

      const response = await fetch("http://localhost/api/dodawanie_zdjec.php", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Dodano zdjęcie.");
        setError("");
        window.location.href = "/panel_admina";
      } else {
        const data = await response.json();
        setError(data.error || "Wystąpił błąd podczas dodawania zdjęcia.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setError("Wystąpił błąd podczas dodawania zdjęcia.");
      setSuccess("");
    }
  };

  return (
    <Container sx={{ marginTop: "5%" }} component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Dodawanie zdjęcia
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Tooltip title="Wybierz zdjęcie">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              onClick={handleChooseImage}
            >
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              <PhotoCamera />
            </IconButton>
          </Tooltip>

          {selectedImage && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Wybrano zdjęcie: {selectedImage.name}
            </Typography>
          )}
          {resizedImage && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Przeskalowano zdjęcie: {resizedImage.name}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Opis zdjęcia"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mt: 2,
            }}
          >
            Dodaj zdjęcie
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && (
            <Typography style={{ color: "green" }}>{success}</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddImages;
