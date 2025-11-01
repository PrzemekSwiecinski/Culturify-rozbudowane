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

const LoginView: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/api/logowanie_uzytkownika.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { token, userId } = data;

        // Zapisz token w localStorage
        localStorage.setItem("authToken", token);

        // Ustaw ID użytkownika w stanie komponentu
        setUserId(userId);

        window.location.href = "/";
        setSuccess("Zalogowano pomyślnie");
        setError("");
      } else {
        const data = await response.json();
        setError(data.error);
        setSuccess("");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setError("Wystąpił błąd podczas logowania");
      setSuccess("");
      console.log("Wysłane dane:", { username, password });
    }
  };

  const handleLoginAsOrganizer = () => {
    window.location.href = "/login_organizatora";
  };

  const handleLoginAsModerator = () => {
    window.location.href = "/login_moderatora";
  };

  const handleLoginAsAdmin = () => {
    window.location.href = "/login_admin";
  };

  return (
    <Container sx={{ marginTop: "6%" }} component="main" maxWidth="xs">
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
          Logowanie
        </Typography>
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box component="form" onSubmit={handleSubmit}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mt: 3,
              mb: 2,
            }}
          >
            Zaloguj się
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && (
            <Typography style={{ color: "green" }}>{success}</Typography>
          )}
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mb: 2,
            }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleLoginAsOrganizer}
          >
            Zaloguj się jako organizator
          </Button>
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mb: 2,
            }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleLoginAsModerator}
          >
            Zaloguj się jako moderator
          </Button>
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mb: 2,
            }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleLoginAsAdmin}
          >
            Zaloguj się jako administrator
          </Button>
          <Button
            sx={{
              backgroundColor: "#808080",
              "&:hover": {
                backgroundColor: "#808080",
              },
            }}
            href="/rejestracja"
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleLoginAsAdmin}
          >
            Zarejestruj się
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginView;
