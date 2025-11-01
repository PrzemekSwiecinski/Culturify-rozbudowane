import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Modal,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Footer from "../components/Footer";

interface Eventt {
  id: number;
  data: string;
  godzina: string;
  nazwa: string;
  opis: string;
}

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Profil", "Moje wydarzenia", "Dodaj wydarzenia", "Wyloguj"];

function OrganizerEvents() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [eventts, setEventts] = useState<Eventt[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Profil") {
      window.location.href = "/profil_organizatora";
    } else if (setting === "Moje wydarzenia") {
      window.location.href = "/wydarzenia_organizatora";
    } else if (setting === "Dodaj wydarzenia") {
      window.location.href = "/dodawanie_wydarzen";
    } else if (setting === "Wyloguj") {
      handleLogoutConfirm();
    } else {
      handleCloseUserMenu();
    }
  };

  const handlePagesClick = (page: string) => {
    if (page === "O Nas") {
      window.location.href = "/onas";
    } else if (page === "Regulamin") {
      window.location.href = "/regulamin";
    } else if (page === "Kontakt") {
      window.location.href = "/kontakt";
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
        // Usuń token z localStorage po wylogowaniu
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

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await axios.post(
        "http://localhost/api/usun_wydarzenie.php",
        { eventId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Jeśli usunięcie się powiedzie, odśwież listę wydarzeń
        const updatedEvents = eventts.filter((eventt) => eventt.id !== eventId);
        setEventts(updatedEvents);
      } else {
        console.error("Błąd podczas usuwania wydarzenia");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas usuwania wydarzenia:", error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setAuthToken(authToken);
    }
  }, []);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (authToken) {
          const response = await fetch(
            "http://localhost/api/wydarzenia_organizatora.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ authToken }),
            }
          );

          if (response.ok) {
            const eventtsData = await response.json();
            setEventts(eventtsData);
          } else {
            console.error("Błąd pobierania danych wizyt lekarza");
          }
        }
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas pobierania danych wizyt lekarza:",
          error
        );
      }
    };

    fetchUserEvents();
  }, [authToken]);

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

  const renderEventts = () => {
    return eventts.map((eventt) => (
      <Card key={eventt.id} sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Data: {eventt.data}, Godzina: {eventt.godzina}
          </Typography>
          <Typography variant="body1">Nazwa: {eventt.nazwa}</Typography>
          <Typography variant="body1">Opis: {eventt.opis}</Typography>
          {/* Przycisk do usuwania wydarzenia */}
          <Button
            onClick={() => handleDeleteEvent(eventt.id)}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Usuń wydarzenie
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Box className="App">
      <AppBar
        position="static"
        sx={{ marginBottom: "5%", backgroundColor: "#800000" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              sx={{ marginLeft: "2%", marginRight: "2%" }}
              alt="logo"
              src="/assets/logo.png"
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Culturify
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              ></IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handlePagesClick(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Avatar
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              alt="profile_pic"
              src="/assets/profile.jpg"
            />
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                marginLeft: "2rem",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePagesClick(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    marginLeft: "1%",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {authToken ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="profile_pic" src="/assets/profile.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleSettingsClick(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  component="a"
                  href="/login"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Zaloguj
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: "5%" }}>
          Moje wydarzenia
        </Typography>
        {eventts.length > 0 ? (
          renderEventts()
        ) : (
          <Typography variant="body1">Brak wydarzeń</Typography>
        )}
      </Container>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        ></Box>
      </Modal>
      <Footer />
    </Box>
  );
}

export default OrganizerEvents;
