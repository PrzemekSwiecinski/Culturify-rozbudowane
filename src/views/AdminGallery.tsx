import React, { useState, useEffect } from "react";
import "../App.css";
import { Typography, Box, Paper, Button, useTheme } from "@mui/material";
import AdminAppBar from "../components/AdminAppBar";

interface ImageData {
  id_zdjecia: number;
  src: string;
  text: string;
}

function AdminGallery() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const theme = useTheme();

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Wyloguj") {
      handleLogoutConfirm();
    } else if (setting === "Dodaj organizatora") {
      window.location.href = "/dodawanie_organizatora";
    } else if (setting === "Dodaj zdjęcia") {
      window.location.href = "/dodawanie_zdjec";
    }
  };

  const handlePagesClick = (page: string) => {
    if (page === "Galeria") {
      window.location.href = "/galeria_admina";
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await fetch("http://localhost/api/wyloguj.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setIsLoggedOut(true);
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/pobierz_zdjecia_admin.php"
        );
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          console.error("Błąd podczas pobierania zdjęć.");
        }
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania zdjęć:", error);
      }
    };
    fetchImages();
  }, []);

  const handleAccept = async (id_zdjecia: number) => {
    try {
      const response = await fetch(
        "http://localhost/api/akceptuj_zdjecie.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_zdjecia: id_zdjecia }),
        }
      );
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Usunięcie zaakceptowanego zdjecia z listy
        setImages((prevImages) =>
          prevImages.filter((image) => image.id_zdjecia !== id_zdjecia)
        );
      } else {
        console.error("Błąd podczas akceptacji zdjęcia.");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas akceptacji zdjęcia:", error);
    }
  };

  return (
    <Box className="App">
      <AdminAppBar
        authToken={authToken}
        onLogout={handleLogout}
        onPagesClick={handlePagesClick}
        onSettingsClick={handleSettingsClick}
      />
      <Box
        sx={{
          marginTop: "5%",
          marginLeft: "10%",
          marginRight: "10%",
          marginBottom: "7%",
        }}
      >
        <Typography sx={{ marginBottom: "4%" }} variant="h3" gutterBottom>
          Panel administracyjny - zdjęcia do akceptacji
        </Typography>
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#f0f0f0",
            }}
          >
            <Box
              sx={{
                width: "150px",
                height: "auto",
                marginRight: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <img
                src={image.src}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Paper
                elevation={2}
                sx={{
                  width: "100%",
                  padding: "5px",
                  textAlign: "center",
                  marginTop: "10px",
                  borderRadius: "5px",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  boxSizing: "border-box",
                }}
              >
                <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                  {image.text}
                </Typography>
              </Paper>
            </Box>

            <Box
              sx={{
                marginLeft: "auto",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#800000",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
                onClick={() => handleAccept(image.id_zdjecia)}
              >
                Zaakceptuj
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default AdminGallery;
