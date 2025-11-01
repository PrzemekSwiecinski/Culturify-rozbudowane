import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";

const RegisterView: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/api/rejestracja_uzytkownika.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            passwordRepeat,
            firstName,
            lastName,
            email,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Rejestracja pomyślna. Możesz teraz się zalogować.");
        setError("");
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccess("");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setError("Wystąpił błąd podczas rejestracji");
      setSuccess("");
      console.log("Wysłane dane:", {
        username,
        password,
        passwordRepeat,
        firstName,
        lastName,
        email,
      });
    }
  };

  return (
    <Container
      sx={{ marginTop: "1%", marginBottom: "1%" }}
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
          Rejestracja
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Login"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Hasło"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordRepeat"
            label="Powtórz hasło"
            type="password"
            id="passwordRepeat"
            autoComplete="new-password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Imię"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Nazwisko"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adres email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Zarejestruj się
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            href="/login"
            sx={{
              backgroundColor: "#808080",
              "&:hover": {
                backgroundColor: "#808080",
              },
              mt: 2,
            }}
          >
            Powrót do logowania
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

export default RegisterView;
