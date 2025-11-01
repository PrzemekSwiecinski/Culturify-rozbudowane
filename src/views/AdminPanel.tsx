import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import Footer from "../components/Footer";
import AdminAppBar from "../components/AdminAppBar";

interface Organizer {
  id_organizatora: number;
  nazwa: string;
  telefon: string;
}

interface Order {
  id_zamowienia: number;
  id_uzytkownika: number;
  cena: number;
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
}

interface Moderator {
  id_moderatora: number;
  imie: string;
  nazwisko: string;
  kategoria: string;
}

function AdminPanel() {
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [textColor, setTextColor] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
    null
  );
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [organizerToDeleteId, setOrganizerToDeleteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchOrders();
    fetchThemeColors();
    fetchModerators();
    let url = "http://localhost/api/pobierz_organizatorow.php";
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);

    axios
      .get(url)
      .then((response) => {
        setOrganizers(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych lekarzy:", error);
      });
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost/api/pobierz_zamowienia_uzytkownikow.php")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zamówień:", error);
      });
  };

  const fetchModerators = () => {
    axios
      .get("http://localhost/api/pobierz_moderatorow.php")
      .then((response) => {
        setModerators(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych moderatorów:", error);
      });
  };

  const fetchThemeColors = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/pobierz_kolory.php"
      );
      setPrimaryColor(response.data.primaryColor || "");
      setSecondaryColor(response.data.secondaryColor || "");
      setTextColor(response.data.textColor || "");
    } catch (error) {
      console.error("Error fetching theme colors:", error);
    }
  };

  const handleColorChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    colorType: string
  ) => {
    const newColor = event.target.value;

    switch (colorType) {
      case "primary":
        setPrimaryColor(newColor);
        break;
      case "secondary":
        setSecondaryColor(newColor);
        break;
      case "text":
        setTextColor(newColor);
        break;
      default:
        break;
    }
  };
  const handleSaveTheme = async () => {
    try {
      await axios.post("http://localhost/api/zapisz_kolory.php", {
        primaryColor,
        secondaryColor,
        textColor,
      });
      alert("Kolory zmienione pomyslnie!");
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

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
    } else if (setting === "Edycja postów") {
      window.location.href = "/edycja_postow";
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

  const handleDeleteOrganizer = async (organizerId: number) => {
    try {
      const response = await axios.post(
        "http://localhost/api/usun_organizatora.php",
        {
          id: organizerId,
        }
      );

      if (response.data.message) {
        const updatedDoctors = organizers.filter(
          (organizer) => organizer.id_organizatora !== organizerId
        );
        setOrganizers(updatedDoctors);
      } else {
        console.error("Błąd usuwania:", response.data.error);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas usuwania:", error);
    }
  };

  const handleChangeModeratorCategory = async (
    event: SelectChangeEvent<string>,
    id_moderatora: number
  ) => {
    try {
      const newCategory = event.target.value;

      await axios.post("http://localhost/api/zmien_kategorie_moderatora.php", {
        id_moderatora,
        kategoria: newCategory,
      });

      setModerators((prevModerators) =>
        prevModerators.map((moderator) =>
          moderator.id_moderatora === id_moderatora
            ? { ...moderator, kategoria: newCategory }
            : moderator
        )
      );
    } catch (error) {
      console.error("Błąd przy zmianie kategorii:", error);
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseDialog = () => {
    setSelectedOrganizer(null);
  };

  return (
    <Box className="App">
      <AdminAppBar
        authToken={authToken}
        onLogout={handleLogout}
        onPagesClick={handlePagesClick}
        onSettingsClick={handleSettingsClick}
      />
      <Typography variant="h4" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Panel administratora
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1%",
          marginBottom: "5%",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "1%" }}>
          Zmień kolor w formacie RGB (#000000):
        </Typography>
        <TextField
          label="Primary Color"
          value={primaryColor}
          onChange={(e) => handleColorChange(e, "primary")}
          sx={{ marginBottom: "1%" }}
        />
        <TextField
          label="Secondary Color"
          value={secondaryColor}
          onChange={(e) => handleColorChange(e, "secondary")}
          sx={{ marginBottom: "1%" }}
        />
        <TextField
          label="Text Color"
          value={textColor}
          onChange={(e) => handleColorChange(e, "text")}
          sx={{ marginBottom: "1%" }}
        />
        <Button
          variant="contained"
          onClick={handleSaveTheme}
          sx={{
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "red",
            },
            marginTop: "2%",
          }}
        >
          Zapisz Kolory
        </Button>
      </Box>
      <Typography variant="h6" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Moderatorzy:
      </Typography>
      <Grid
        sx={{
          flexDirection: "column",
          alignContent: "center",
          marginTop: "1%",
          marginBottom: "5%",
        }}
        container
        spacing={2}
        justifyContent="center"
      >
        {moderators.map((moderator) => (
          <Grid
            sx={{ width: "100%" }}
            item
            key={moderator.id_moderatora}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
                cursor: "pointer",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle1">
                    Id moderatora: {moderator.id_moderatora}
                  </Typography>
                  <Typography variant="body1">
                    Imie: {moderator.imie}
                  </Typography>
                  <Typography variant="body1">
                    Nazwisko: {moderator.nazwisko}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "10%",
                      marginBottom: "5%",
                    }}
                  >
                    <Typography variant="body1" sx={{ marginRight: "10px" }}>
                      Kategoria:
                    </Typography>
                    <Select
                      value={moderator.kategoria}
                      onChange={(event) =>
                        handleChangeModeratorCategory(
                          event,
                          moderator.id_moderatora
                        )
                      }
                      sx={{ minWidth: "150px" }}
                    >
                      <MenuItem value="Pomoc techniczna">
                        Pomoc techniczna
                      </MenuItem>
                      <MenuItem value="Informacje o wydarzeniach">
                        Informacje o wydarzeniach
                      </MenuItem>
                      <MenuItem value="Informacje o biletach">
                        Informacje o biletach
                      </MenuItem>
                    </Select>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Organizatorzy:
      </Typography>
      <Grid
        sx={{
          flexDirection: "column",
          alignContent: "center",
          marginTop: "1%",
          marginBottom: "5%",
        }}
        container
        spacing={2}
        justifyContent="center"
      >
        {organizers.map((organizer) => (
          <Grid
            sx={{ width: "100%" }}
            item
            key={organizer.id_organizatora}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
                cursor: "pointer",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{organizer.nazwa}</Typography>
                  <Typography
                    sx={{ marginTop: "10%" }}
                    variant="body1"
                    color="text.secondary"
                  >
                    {organizer.telefon}
                  </Typography>
                </Box>
                <Button
                  sx={{
                    backgroundColor: "var(--primary-color)",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                    marginLeft: "auto",
                  }}
                  variant="contained"
                  onClick={() =>
                    handleDeleteOrganizer(organizer.id_organizatora)
                  }
                >
                  Usuń
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Zamówienia:
      </Typography>
      <Grid
        sx={{
          flexDirection: "column",
          alignContent: "center",
          marginTop: "1%",
          marginBottom: "5%",
        }}
        container
        spacing={2}
        justifyContent="center"
      >
        {orders.map((order) => (
          <Grid
            sx={{ width: "100%" }}
            item
            key={order.id_zamowienia}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
                cursor: "pointer",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle1">
                    Id zamówienia: {order.id_zamowienia}
                  </Typography>
                  <Typography variant="body1">Cena: {order.cena}</Typography>
                  <Typography variant="subtitle2">Użytkownik:</Typography>
                  <Typography variant="body1">Imię: {order.imie}</Typography>
                  <Typography variant="body1">
                    Nazwisko: {order.nazwisko}
                  </Typography>
                  <Typography variant="body1">Email: {order.email}</Typography>
                  <Typography sx={{ marginBottom: "10%" }} variant="body1">
                    Telefon: {order.telefon}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={Boolean(selectedOrganizer)}
        onClose={handleCloseDialog}
        aria-labelledby="doctor-modal"
        aria-describedby="doctor-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Typography variant="h6">{selectedOrganizer?.nazwa}</Typography>
          <Button onClick={handleCloseDialog}>Zamknij</Button>
        </Box>
      </Modal>
      <Footer />
    </Box>
  );
}

export default AdminPanel;
