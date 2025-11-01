import React, { useState, useEffect } from "react";
import "../App.css";
import {
  MenuItem,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Menu,
  Tooltip,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Footer from "../components/Footer";

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Profil", "Moje bilety", "Ryneczek Culturify", "Wyloguj"];

interface UserData {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  pesel: string;
  portfel: number;
}

function UserView() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleSettingsClick = (setting: string) => {
    if (setting === "Profil") {
      window.location.href = "/profil_uzytkownika";
    } else if (setting === "Moje bilety") {
      window.location.href = "/bilety_uzytkownika";
    } else if (setting === "Ryneczek Culturify") {
      window.location.href = "/rynek_biletow";
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
        localStorage.removeItem("authToken");
        setAuthToken(null);
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  const handleDoladuj = async () => {
    try {
      const response = await fetch("http://localhost/api/doladuj.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authToken }),
      });

      if (response.ok) {
        // Zakładając, że doladuj.php zwraca zaktualizowane dane użytkownika
        const updatedUserData = await response.json();
        setUserData(updatedUserData);
      } else {
        console.error("Błąd doładowania portfela");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas doładowania portfela:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/pobierz_dane_uzytkownika.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ authToken }),
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          console.error("Błąd pobierania danych użytkownika");
        }
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas pobierania danych użytkownika:",
          error
        );
      }
    };

    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);
  });

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

  return (
    <Box className="App">
      <AppBar
        position="static"
        sx={{ marginBottom: "5%", backgroundColor: "#800000" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              sx={{ marginLeft: "8%", marginRight: "2%" }}
              alt="logo"
              src="/assets/logo.png"
            />
            <Typography
              variant="h6"
              noWrap
              href="/"
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
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
                <Button component="a" href="/rejestracja" color="inherit">
                  Zarejestruj
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Card
        sx={{
          maxWidth: 300,
          margin: "auto",
          marginBottom: "9%",
          marginTop: "8%",
        }}
      >
        <Avatar
          alt="User Avatar"
          src="assets/profile.jpg"
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            marginTop: "10%",
            marginBottom: "10%",
          }}
        />
        <CardContent>
          {userData ? (
            <>
              <Box
                sx={{
                  marginTop: "5%",
                  marginBottom: "5%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: "5%",
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: "10%" }}>
                  {userData.imie} {userData.nazwisko}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                  <strong>Email:</strong> {userData.email}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                  <strong>Numer telefonu:</strong> {userData.telefon}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                  <strong>PESEL:</strong> {userData.pesel}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                  <strong>Saldo:</strong> {userData.portfel}
                  {"zł"}
                </Typography>
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
                  onClick={handleDoladuj}
                >
                  Doładuj
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1">Ładowanie danych...</Typography>
          )}
        </CardContent>
      </Card>
      <Footer />
    </Box>
  );
}

export default UserView;
