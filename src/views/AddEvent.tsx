import React, { useState, useEffect } from "react";
import {
  Container,
  CssBaseline,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";

const AddEvent: React.FC = () => {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/api/dodawanie_wydarzenia.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            name,
            date,
            time,
            city,
            address,
            description,
            photo,
            price,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Dodano wydarzenie.");
        setError("");
        window.location.href = "/wydarzenia_organizatora";
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccess("");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setError("Wystąpił błąd podczas dodawania");
      setSuccess("");
      console.log("Wysłane dane:", {
        type,
        name,
        date,
        time,
        city,
        address,
        description,
        photo,
        price,
      });
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);
  });

  return (
    <Container
      sx={{ marginTop: "3%", marginBottom: "3%" }}
      component="main"
      maxWidth="xs"
    >
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
          Dodawanie wydarzenia
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="type"
            label="Typ"
            name="type"
            autoComplete="family-name"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nazwa"
            name="name"
            autoComplete="family-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="date"
            label="Data"
            name="date"
            autoComplete="family-name"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="time"
            label="Godzina"
            name="time"
            autoComplete="family-name"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="city"
            label="Miasto"
            name="city"
            autoComplete="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Adres"
            name="address"
            autoComplete="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Opis"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="photo"
            label="Zdjęcie"
            name="photo" // Zmieniono name na "photo"
            autoComplete="photo" // Zmieniono autoComplete na "photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Cena"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            Dodaj wydarzenie
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

export default AddEvent;
